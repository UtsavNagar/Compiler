import React from 'react';

// Simple icon components
const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const LayoutGridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-4.04Z"></path>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-4.04Z"></path>
  </svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

// Fixed Link component with TypeScript types
interface LinkProps {
  to: string;
  className?: string;
  children: React.ReactNode;
}

const Link: React.FC<LinkProps> = ({ to, className, children }) => (
  <a href={to} className={className}>{children}</a>
);

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Navigation Bar */}
      <nav className="px-6 py-4 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <CodeIcon />
          <span className="font-bold text-xl">CodeCompile</span>
        </div>
        
        {/* Added the requested menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/html-compiler" className="hover:text-blue-400 transition">
            HTML Compiler
          </Link>
          <Link to="/cpp-compiler" className="hover:text-blue-400 transition">
            C++ Compiler
          </Link>
          <Link to="/java-compiler" className="hover:text-blue-400 transition">
            Java Compiler
          </Link>
          <Link to="/python-compiler" className="hover:text-blue-400 transition">
            Python Compiler
          </Link>
          <Link to="/js-compiler" className="hover:text-blue-400 transition">
            JS Compiler
          </Link>
          <Link to="/code-converter" className="hover:text-blue-400 transition">
            AI Converter
          </Link>
        </div>
        
        <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md font-semibold transition">
          Try Now
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Modern Code Compilation
          <span className="text-blue-400">.</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 md:w-3/4 mx-auto">
          A lightweight, blazing-fast code compiler for developers who value simplicity and efficiency.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-md font-semibold transition flex items-center justify-center">
            Start Coding <ArrowRightIcon />
          </button>
          <button className="bg-transparent border border-gray-600 hover:border-gray-400 px-6 py-3 rounded-md font-semibold transition">
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16 bg-gray-800 rounded-lg my-8 shadow-xl">
        <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-700 p-6 rounded-lg">
            <div className="bg-blue-500 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <CodeIcon />
            </div>
            <h3 className="text-xl font-semibold mb-2">Simple Code Compilation</h3>
            <p className="text-gray-300">
              Compile your code with a single click. Support for multiple programming languages with Java APIs integration.
            </p>
          </div>
          
          <div className="bg-gray-700 p-6 rounded-lg">
            <div className="bg-green-500 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <LayoutGridIcon />
            </div>
            <h3 className="text-xl font-semibold mb-2">Lightweight Website</h3>
            <p className="text-gray-300">
              Built with performance in mind. Our compiler loads instantly and works smoothly even on slower connections.
            </p>
          </div>
          
          <div className="bg-gray-700 p-6 rounded-lg">
            <div className="bg-purple-500 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <ZapIcon />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quick Response</h3>
            <p className="text-gray-300">
              Get compilation results in milliseconds. Our optimized backend ensures minimal latency for all operations.
            </p>
          </div>
        </div>
        
        {/* Added new features section */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="bg-gray-700 p-6 rounded-lg">
            <div className="bg-yellow-500 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <PlayIcon />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time HTML Output</h3>
            <p className="text-gray-300">
              See your HTML changes instantly with our live preview feature. Perfect for web developers who want immediate visual feedback.
            </p>
          </div>
          
          <div className="bg-gray-700 p-6 rounded-lg">
            <div className="bg-red-500 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <BrainIcon />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Code Converter</h3>
            <p className="text-gray-300">
              Easily convert code between Java, C++, Python, and JavaScript with our AI-powered code translation tool.
            </p>
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Supported Languages</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition cursor-pointer">
            <div className="text-5xl font-bold mb-2 text-blue-400">&#60;/&#62;</div>
            <h3 className="text-xl font-semibold">HTML</h3>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition cursor-pointer">
            <div className="text-5xl font-bold mb-2 text-purple-400">C++</div>
            <h3 className="text-xl font-semibold">C++</h3>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition cursor-pointer">
            <div className="text-5xl font-bold mb-2 text-orange-400">☕</div>
            <h3 className="text-xl font-semibold">Java</h3>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition cursor-pointer">
            <div className="text-5xl font-bold mb-2 text-yellow-400">🐍</div>
            <h3 className="text-xl font-semibold">Python</h3>
          </div>
        </div>
      </section>

      {/* Code Demo Section */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
          <div className="bg-gray-700 px-4 py-2 flex items-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="ml-4 text-gray-400">example.ts</span>
          </div>
          <div className="p-6 bg-gray-900 font-mono text-sm overflow-x-auto">
            <pre className="text-gray-300">
              <span className="text-purple-400">interface</span> <span className="text-yellow-300">User</span> {"{"}
              {"\n"}  <span className="text-blue-300">name</span>: <span className="text-green-300">string</span>;
              {"\n"}  <span className="text-blue-300">age</span>: <span className="text-green-300">number</span>;
              {"\n"}  <span className="text-blue-300">isActive</span>: <span className="text-green-300">boolean</span>;
              {"\n"}{"}"}
              {"\n\n"}<span className="text-purple-400">function</span> <span className="text-yellow-300">greetUser</span>(<span className="text-blue-300">user</span>: <span className="text-green-300">User</span>): <span className="text-green-300">string</span> {"{"}
              {"\n"}  <span className="text-purple-400">return</span> <span className="text-orange-300">`Hello, ${"{"}</span><span className="text-blue-300">user.name</span><span className="text-orange-300">{"}"}, welcome to CodeCompile!`</span>;
              {"\n"}{"}"}
            </pre>
          </div>
        </div>
      </section>

      {/* Code Languages Section - Added this new section */}
      <section className="max-w-6xl mx-auto px-6 py-12 bg-gray-800 rounded-lg">
        <h2 className="text-3xl font-bold mb-8">Our Code Compilers</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-700 p-5 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-400 mb-2">Java Code Compiler</h3>
            <p className="mb-4">Compile and run Java code with full API support. Perfect for building robust applications.</p>
            <p className="text-sm text-gray-400 mb-2">Note: Compile time input features not available</p>
            <div className="flex justify-end">
              <Link to="/java-compiler" className="text-blue-400 hover:text-blue-300 flex items-center">
                Try now <ArrowRightIcon />
              </Link>
            </div>
          </div>
          
          <div className="bg-gray-700 p-5 rounded-lg">
            <h3 className="text-xl font-semibold text-purple-400 mb-2">C++ Code Compiler</h3>
            <p className="mb-4">Powerful C++ compilation with optimization options for high-performance applications.</p>
            <p className="text-sm text-gray-400 mb-2">Note: Compile time input features not available</p>
            <div className="flex justify-end">
              <Link to="/cpp-compiler" className="text-purple-400 hover:text-purple-300 flex items-center">
                Try now <ArrowRightIcon />
              </Link>
            </div>
          </div>
          
          <div className="bg-gray-700 p-5 rounded-lg">
            <h3 className="text-xl font-semibold text-yellow-400 mb-2">Python Code Compiler</h3>
            <p className="mb-4">Run Python scripts with support for popular libraries and frameworks.</p>
            <p className="text-sm text-gray-400 mb-2">Note: Compile time input features not available</p>
            <div className="flex justify-end">
              <Link to="/python-compiler" className="text-yellow-400 hover:text-yellow-300 flex items-center">
                Try now <ArrowRightIcon />
              </Link>
            </div>
          </div>
          
          <div className="bg-gray-700 p-5 rounded-lg">
            <h3 className="text-xl font-semibold text-green-400 mb-2">JavaScript Code Compiler</h3>
            <p className="mb-4">Execute JavaScript code with browser APIs and Node.js compatibility.</p>
            <p className="text-sm text-gray-400 mb-2">Note: Compile time input features not available</p>
            <div className="flex justify-end">
              <Link to="/js-compiler" className="text-green-400 hover:text-green-300 flex items-center">
                Try now <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time HTML Output Demo */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8">Real-time HTML Output</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gray-700 px-4 py-2">
              <span className="text-gray-300">HTML Editor</span>
            </div>
            <div className="p-4 bg-gray-900 font-mono text-sm h-64">
              <pre className="text-gray-300">
                <span className="text-blue-400">&lt;div</span> <span className="text-green-400">class=</span><span className="text-orange-400">"container"</span><span className="text-blue-400">&gt;</span>
                {"\n"}  <span className="text-blue-400">&lt;h1</span> <span className="text-green-400">class=</span><span className="text-orange-400">"title"</span><span className="text-blue-400">&gt;</span>Hello World<span className="text-blue-400">&lt;/h1&gt;</span>
                {"\n"}  <span className="text-blue-400">&lt;p&gt;</span>Edit this code and see changes instantly!<span className="text-blue-400">&lt;/p&gt;</span>
                {"\n"}  <span className="text-blue-400">&lt;button</span> <span className="text-green-400">class=</span><span className="text-orange-400">"btn"</span><span className="text-blue-400">&gt;</span>Click Me<span className="text-blue-400">&lt;/button&gt;</span>
                {"\n"}<span className="text-blue-400">&lt;/div&gt;</span>
              </pre>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gray-700 px-4 py-2">
              <span className="text-gray-300">Live Preview</span>
            </div>
            <div className="p-4 bg-white text-black h-64">
              <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-2">Hello World</h1>
                <p className="mb-4">Edit this code and see changes instantly!</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Click Me</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Code Converter Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg my-8">
        <h2 className="text-3xl font-bold mb-4 text-center">AI Code Converter</h2>
        <p className="text-xl text-center mb-8">Convert code between languages with our intelligent AI-powered translator</p>
        
        <div className="flex justify-center">
          <Link to="/code-converter" className="bg-white text-purple-700 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition flex items-center">
            Try AI Code Converter <BrainIcon />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start coding?</h2>
          <p className="text-xl mb-8">
            Join thousands of developers who trust our platform for their coding needs.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition">
            Get Started for Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-700 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <CodeIcon />
              <span className="font-bold">CodeCompile</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-500">
            &copy; {new Date().getFullYear()} CodeCompile. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;