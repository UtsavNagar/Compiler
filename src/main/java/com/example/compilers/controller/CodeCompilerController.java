package com.example.compilers.controller;

import org.springframework.web.bind.annotation.*;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;

@RestController
@RequestMapping("/api/compile")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend requests
public class CodeCompilerController {
    // Rest of your controller code remains the same
    @PostMapping("/cpp")
    public String compileCppCode(@RequestBody CodeRequest request) {
        return compileAndRun("temp.cpp", "g++ temp.cpp -o temp.out", "./temp.out", request.getCode(), request.getInput());
    }
    
    @PostMapping("/java")
    public String compileJavaCode(@RequestBody CodeRequest request) {
        String filename = "Main.java";
        return compileAndRun(filename, "javac " + filename, "java Main", request.getCode(), request.getInput());
    }
    
    @PostMapping("/python")
    public String executePythonCode(@RequestBody CodeRequest request) {
        return executeScript("script.py", "python3 script.py", request.getCode(), request.getInput());
    }
    
    @PostMapping("/javascript")
    public String executeJavaScriptCode(@RequestBody CodeRequest request) {
        return executeScript("script.js", "node script.js", request.getCode(), request.getInput());
    }
    
    private String compileAndRun(String filename, String compileCommand, String runCommand, String code, String input) {
        try {
            // Write code to a file
            writeFile(filename, code);
            // Compile the code
            Process compileProcess = new ProcessBuilder(compileCommand.split(" ")).start();
            compileProcess.waitFor();
            if (compileProcess.exitValue() != 0) {
                return "Compilation Error!";
            }
            // Run the compiled program
            return runProcess(runCommand, input);
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
    
    private String executeScript(String filename, String runCommand, String code, String input) {
        try {
            // Write code to a file
            writeFile(filename, code);
            return runProcess(runCommand, input);
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
    
    private void writeFile(String filename, String content) throws IOException {
        Files.write(Path.of(filename), content.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
    }
    
    private String runProcess(String command, String input) throws IOException, InterruptedException {
        Process process = new ProcessBuilder(command.split(" ")).start();
        // Write input to process
        OutputStream processInput = process.getOutputStream();
        processInput.write(input.getBytes());
        processInput.flush();
        processInput.close();
        // Capture output
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        StringBuilder output = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            output.append(line).append("\n");
        }
        reader.close();
        process.waitFor();
        return output.toString();
    }
    
    public static class CodeRequest {
        private String code;
        private String input;
        
        public String getCode() {
            return code;
        }
        
        public String getInput() {
            return input;
        }
    }
}