package com.example.compilers.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HelloController {
    
    @GetMapping("/welcome")
    @ResponseBody
    public String welcome() {
        return "Welcome";
    }
    
    @GetMapping("/")
    @ResponseBody
    public String showHello() {
        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Hello Animation</title>
                    <style>
                        body {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            background: linear-gradient(to bottom, #87CEEB, #E0F6FF);
                            margin: 0;
                            overflow: hidden;
                        }
                        .hello {
                            font-size: 50px;
                            font-weight: bold;
                            color: black;
                            text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
                            position: absolute;
                            animation: riseUp 2s ease-out forwards;
                        }
                        @keyframes riseUp {
                            0% {
                                transform: translateY(100px);
                                opacity: 0;
                            }
                            100% {
                                transform: translateY(0);
                                opacity: 1;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="hello">Hello</div>
                </body>
                </html>
                """;
    }
}