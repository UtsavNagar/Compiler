package com.example.compiler.controller;

import org.springframework.web.bind.annotation.*;
import java.io.*;

@RestController
@RequestMapping("/api/compile")
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from frontend
public class CppCompilerController {

    @PostMapping("/cpp")
    public String compileCppCode(@RequestBody String code) {
        try {
            // Write C++ code to a temporary file
            String filename = "temp.cpp";
            FileWriter writer = new FileWriter(filename);
            writer.write(code);
            writer.close();

            // Compile the C++ code
            Process compileProcess = new ProcessBuilder("g++", filename, "-o", "temp.out").start();
            compileProcess.waitFor();

            // Check if compilation was successful
            if (compileProcess.exitValue() != 0) {
                return "Compilation Error!";
            }

            // Execute the compiled program
            Process runProcess = new ProcessBuilder("./temp.out").start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(runProcess.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            return output.toString();

        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}
