import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';


const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeInDelayed = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3 } },
};

const scaleUp = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
};

// Simple SVG Icons with Animation
const AnimatedIcon = ({ children }: { children: React.ReactNode }) => (
  <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="p-3 rounded-full">
    {children}
  </motion.div>
);

const CodeIcon = () => (
  <AnimatedIcon>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  </AnimatedIcon>
);

const ArrowRightIcon = () => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    initial={{ x: -5 }}
    animate={{ x: 0 }}
    transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.8 }}
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </motion.svg>
);


const BrainIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-4.04Z"></path>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-4.04Z"></path>
  </svg>
);


const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">

      {/* Hero Section */}
      <motion.section initial="hidden" animate="visible" variants={fadeIn} className="max-w-5xl mx-auto px-6 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Modern Code Compilation
          <span className="text-blue-400">.</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 md:w-3/4 mx-auto">
          A lightweight, blazing-fast code compiler for developers who value simplicity and efficiency.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link to={"/compilers"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-md font-semibold transition flex items-center justify-center"
            >
              Start Coding <ArrowRightIcon />
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-transparent border border-gray-600 hover:border-gray-400 px-6 py-3 rounded-md font-semibold transition"
          >
            Learn More
          </motion.button>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section id="features" initial="hidden" animate="visible" variants={fadeInDelayed} className="max-w-6xl mx-auto px-6 py-16 bg-gray-800 rounded-lg my-8 shadow-xl">
        <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Simple Code Compilation", desc: "Compile your code with a single click. Supports multiple programming languages.", icon: <CodeIcon />, color: "blue" },
            { title: "Lightweight Website", desc: "Built for performance. Loads instantly and runs smoothly.", icon: <CodeIcon />, color: "green" },
            { title: "Quick Response", desc: "Get compilation results in milliseconds with optimized backend.", icon: <CodeIcon />, color: "purple" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className={`bg-gray-700 p-6 rounded-lg hover:shadow-lg transform transition-all duration-300 hover:-translate-y-2`}
              initial="hidden"
              animate="visible"
              variants={scaleUp}
            >
              <div className={`bg-${feature.color}-500 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
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
              <Link to="/compilers" className="text-blue-400 hover:text-blue-300 flex items-center">
                Try now <ArrowRightIcon />
              </Link>
            </div>
          </div>

          <div className="bg-gray-700 p-5 rounded-lg">
            <h3 className="text-xl font-semibold text-purple-400 mb-2">C++ Code Compiler</h3>
            <p className="mb-4">Powerful C++ compilation with optimization options for high-performance applications.</p>
            <p className="text-sm text-gray-400 mb-2">Note: Compile time input features not available</p>
            <div className="flex justify-end">
              <Link to="/compilers" className="text-purple-400 hover:text-purple-300 flex items-center">
                Try now <ArrowRightIcon />
              </Link>
            </div>
          </div>

          <div className="bg-gray-700 p-5 rounded-lg">
            <h3 className="text-xl font-semibold text-yellow-400 mb-2">Python Code Compiler</h3>
            <p className="mb-4">Run Python scripts with support for popular libraries and frameworks.</p>
            <p className="text-sm text-gray-400 mb-2">Note: Compile time input features not available</p>
            <div className="flex justify-end">
              <Link to="/compilers" className="text-yellow-400 hover:text-yellow-300 flex items-center">
                Try now <ArrowRightIcon />
              </Link>
            </div>
          </div>

          <div className="bg-gray-700 p-5 rounded-lg">
            <h3 className="text-xl font-semibold text-green-400 mb-2">JavaScript Code Compiler</h3>
            <p className="mb-4">Execute JavaScript code with browser APIs and Node.js compatibility.</p>
            <p className="text-sm text-gray-400 mb-2">Note: Compile time input features not available</p>
            <div className="flex justify-end">
              <Link to="/compilers" className="text-green-400 hover:text-green-300 flex items-center">
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