import React, { useState, useRef } from 'react';

// Available programming languages
type ProgrammingLanguage = 'C' | 'C++' | 'Java' | 'JavaScript' | 'Python';

// Type for API response from Gemini
interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

// Type for converted code and analysis
type ConversionResult = {
  code: string;
  intuition?: string;
  approach?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
};

// Type for overall results
type ConversionResults = {
  [key in ProgrammingLanguage]?: ConversionResult;
};

const CodeConverter: React.FC = () => {
  const [sourceCode, setSourceCode] = useState<string>('');
  const [sourceLanguage, setSourceLanguage] = useState<ProgrammingLanguage>('Python');
  const [targetLanguages, setTargetLanguages] = useState<ProgrammingLanguage[]>([]);
  const [results, setResults] = useState<ConversionResults>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showIntuition, setShowIntuition] = useState<boolean>(false);
  const [showApproach, setShowApproach] = useState<boolean>(false);
  const [showComplexity, setShowComplexity] = useState<boolean>(false);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState<boolean>(false);
  
  // For copying text
  const copyTimeoutRef = useRef<{ [key: string]: ReturnType<typeof setTimeout> }>({});
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});

  // Available languages
  const languages: ProgrammingLanguage[] = ['C', 'C++', 'Java', 'JavaScript', 'Python'];

  const handleTargetLanguageToggle = (language: ProgrammingLanguage) => {
    if (language === sourceLanguage) return;
    
    setTargetLanguages(prev => {
      if (prev.includes(language)) {
        return prev.filter(lang => lang !== language);
      } else {
        return [...prev, language];
      }
    });
  };

  // Gemini API calls
  const convertCodeWithGemini = async (
    code: string,
    from: ProgrammingLanguage,
    to: ProgrammingLanguage
  ): Promise<string> => {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAXGGPGdUIx8nrr3auhN_xn99rXA8311wg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Convert this ${from} code to ${to}. Return only the converted code:\n\n${code}` }] }]
        })
      });
      
      const data: GeminiResponse = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error converting code:', error);
      return `// Error converting to ${to}\n// Please try again`;
    }
  };

  const generateAnalysis = async (
    code: string,
    language: ProgrammingLanguage
  ): Promise<{
    intuition?: string;
    approach?: string;
    timeComplexity?: string;
    spaceComplexity?: string;
  }> => {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAXGGPGdUIx8nrr3auhN_xn99rXA8311wg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ 
              text: `Analyze this ${language} code and provide:
              1. The intuition behind the algorithm
              2. The approach used in the code
              3. The time complexity (Big O notation)
              4. The space complexity (Big O notation)
              
              Format your response in JSON like:
              {
                "intuition": "explanation here",
                "approach": "explanation here",
                "timeComplexity": "O(?)",
                "spaceComplexity": "O(?)"
              }
              
              Here's the code:
              
              ${code}`
            }] 
          }]
        })
      });
      
      const data: GeminiResponse = await response.json();
      const responseText = data.candidates[0].content.parts[0].text;
      
      // Try to extract the JSON part
      try {
        // Look for JSON-like structure in the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        // Fallback to simple parsing
        return {
          intuition: "Could not parse intuition from API response.",
          approach: "Could not parse approach from API response.",
          timeComplexity: "Unknown",
          spaceComplexity: "Unknown"
        };
      } catch (parseError) {
        console.error('Error parsing analysis:', parseError);
        return {
          intuition: "Error generating analysis.",
          approach: "Error generating analysis.",
          timeComplexity: "Unknown",
          spaceComplexity: "Unknown"
        };
      }
    } catch (error) {
      console.error('Error generating analysis:', error);
      return {
        intuition: "Error generating analysis.",
        approach: "Error generating analysis.",
        timeComplexity: "Unknown",
        spaceComplexity: "Unknown"
      };
    }
  };

  const handleConvert = async () => {
    if (!sourceCode.trim()) {
      setError('Please enter some code to convert');
      return;
    }
    
    if (targetLanguages.length === 0) {
      setError('Please select at least one target language');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newResults: ConversionResults = {};
      
      // Convert code to each selected target language
      await Promise.all(
        targetLanguages.map(async (language) => {
          const convertedCode = await convertCodeWithGemini(sourceCode, sourceLanguage, language);
          newResults[language] = {
            code: convertedCode
          };
        })
      );
      
      setResults(newResults);
    } catch (err) {
      setError('Error converting code. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAnalysis = async () => {
    if (Object.keys(results).length === 0) {
      setError('Please convert some code first');
      return;
    }
    
    setIsGeneratingAnalysis(true);
    
    try {
      const newResults = { ...results };
      
      // Generate analysis for each language
      await Promise.all(
        Object.entries(results).map(async ([language, result]) => {
          if (!result) return;
          
          const analysis = await generateAnalysis(result.code, language as ProgrammingLanguage);
          
          newResults[language as ProgrammingLanguage] = {
            ...result,
            ...analysis
          };
        })
      );
      
      setResults(newResults);
    } catch (err) {
      setError('Error generating analysis. Please try again.');
      console.error(err);
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  const copyToClipboard = (text: string, language: ProgrammingLanguage) => {
    navigator.clipboard.writeText(text);
    
    // Set copied state
    setCopiedStates(prev => ({
      ...prev,
      [language]: true
    }));
    
    // Clear existing timeout
    if (copyTimeoutRef.current[language]) {
      clearTimeout(copyTimeoutRef.current[language]);
    }
    
    // Set timeout to reset copied state
    copyTimeoutRef.current[language] = setTimeout(() => {
      setCopiedStates(prev => ({
        ...prev,
        [language]: false
      }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Code Converter</h1>
        
        {/* Source code and language */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-2">
            <div className="flex-1">
              <label className="block mb-2 font-medium">Source Language</label>
              <select
                value={sourceLanguage}
                onChange={(e) => {
                  const newSourceLang = e.target.value as ProgrammingLanguage;
                  setSourceLanguage(newSourceLang);
                  // Remove source language from target languages if selected
                  setTargetLanguages(prev => 
                    prev.filter(lang => lang !== newSourceLang)
                  );
                }}
                className="w-full bg-gray-800 text-white rounded-md p-2 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block mb-2 font-medium">Target Languages</label>
              <div className="flex flex-wrap gap-2">
                {languages.map(lang => (
                  <button
                    key={lang}
                    onClick={() => handleTargetLanguageToggle(lang)}
                    disabled={lang === sourceLanguage}
                    className={`px-3 py-1 rounded-full text-sm font-medium 
                      ${lang === sourceLanguage 
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                        : targetLanguages.includes(lang)
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <label className="block mb-2 font-medium">Source Code</label>
          <textarea
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            placeholder={`Enter your ${sourceLanguage} code here...`}
            className="w-full h-64 bg-gray-800 text-white rounded-md p-4 border border-gray-700 font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <div className="mt-4">
            <button
              onClick={handleConvert}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Converting...' : 'Convert Code'}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200">
              {error}
            </div>
          )}
        </div>
        
        {/* Results section */}
        {Object.keys(results).length > 0 && (
          <>
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Converted Code</h2>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateAnalysis}
                    disabled={isGeneratingAnalysis}
                    className="px-4 py-1 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 disabled:opacity-50"
                  >
                    {isGeneratingAnalysis ? 'Analyzing...' : 'Generate Analysis'}
                  </button>
                  
                  {/* Analysis toggle buttons */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => setShowIntuition(!showIntuition)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        showIntuition 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      Intuition
                    </button>
                    <button
                      onClick={() => setShowApproach(!showApproach)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        showApproach 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      Approach
                    </button>
                    <button
                      onClick={() => setShowComplexity(!showComplexity)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        showComplexity 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      Complexity
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Converted code grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {targetLanguages.map(language => {
                  const result = results[language];
                  if (!result) return null;
                  
                  return (
                    <div key={language} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                      <div className="bg-gray-700 p-3 flex justify-between items-center">
                        <h3 className="font-bold">{language}</h3>
                        <button
                          onClick={() => copyToClipboard(result.code, language)}
                          className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm"
                        >
                          {copiedStates[language] ? 'Copied!' : 'Copy Code'}
                        </button>
                      </div>
                      <div className="p-4">
                        <pre className="bg-gray-900 p-4 rounded overflow-x-auto font-mono text-sm">
                          {result.code}
                        </pre>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Conditional analysis sections */}
            {showIntuition && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">Intuition</h2>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  {Object.entries(results).map(([language, result]) => {
                    if (!result || !result.intuition) return null;
                    
                    return (
                      <div key={`${language}-intuition`} className="mb-4 last:mb-0">
                        <h3 className="text-lg font-medium text-blue-400 mb-2">{language}</h3>
                        <p className="text-sm whitespace-pre-line">{result.intuition}</p>
                      </div>
                    );
                  })}
                  {!Object.values(results).some(result => result?.intuition) && (
                    <p className="text-gray-400">Click "Generate Analysis" to see the intuition for each algorithm</p>
                  )}
                </div>
              </div>
            )}
            
            {showApproach && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">Approach</h2>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  {Object.entries(results).map(([language, result]) => {
                    if (!result || !result.approach) return null;
                    
                    return (
                      <div key={`${language}-approach`} className="mb-4 last:mb-0">
                        <h3 className="text-lg font-medium text-blue-400 mb-2">{language}</h3>
                        <p className="text-sm whitespace-pre-line">{result.approach}</p>
                      </div>
                    );
                  })}
                  {!Object.values(results).some(result => result?.approach) && (
                    <p className="text-gray-400">Click "Generate Analysis" to see the approach for each algorithm</p>
                  )}
                </div>
              </div>
            )}
            
            {showComplexity && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">Complexity Analysis</h2>
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(results).map(([language, result]) => {
                      if (!result || (!result.timeComplexity && !result.spaceComplexity)) return null;
                      
                      return (
                        <div key={`${language}-complexity`} className="p-3 bg-gray-700 rounded-lg">
                          <h3 className="text-lg font-medium text-blue-400 mb-2">{language}</h3>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <h4 className="text-sm font-medium">Time</h4>
                              <p className="text-sm">{result.timeComplexity || 'Unknown'}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Space</h4>
                              <p className="text-sm">{result.spaceComplexity || 'Unknown'}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {!Object.values(results).some(result => result?.timeComplexity || result?.spaceComplexity) && (
                    <p className="text-gray-400">Click "Generate Analysis" to see the complexity analysis for each algorithm</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CodeConverter;