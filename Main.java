public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");

        // 1. Basic Arithmetic Operations
        int a = 10;
        int b = 5;
        int sum = a + b;
        int difference = a - b;
        int product = a * b;
        int quotient = a / b;
        int remainder = a % b;

        System.out.println("Sum: " + sum);
        System.out.println("Difference: " + difference);
        System.out.println("Product: " + product);
        System.out.println("Quotient: " + quotient);
        System.out.println("Remainder: " + remainder);

        // 2. Conditional Statements
        if (a > b) {
            System.out.println("a is greater than b");
        } else if (a < b) {
            System.out.println("a is less than b");
        } else {
            System.out.println("a is equal to b");
        }

        // 3. Loops
        for (int i = 0; i < 5; i++) {
            System.out.println("Loop i: " + i);
        }

        int j = 0;
        while (j < 3) {
            System.out.println("Loop j: " + j);
            j++;
        }

        int k = 0;
        do {
            System.out.println("Loop k: " + k);
            k++;
        } while (k < 2);

        // 4. Arrays
        int[] numbers = {1, 2, 3, 4, 5};
        for (int num : numbers) {
            System.out.println("Number: " + num);
        }

        // 5. String Operations
        String message = "Java is fun!";
        System.out.println("Message length: " + message.length());
        System.out.println("Message uppercase: " + message.toUpperCase());
        System.out.println("Message substring: " + message.substring(0, 4));

        // 6. Exception Handling
        try {
            int result = 10 / 0; // This will cause an ArithmeticException
            System.out.println("Result: " + result);
        } catch (ArithmeticException e) {
            System.err.println("Exception caught: " + e.getMessage());
        }

        // 7. Methods
        int result = add(a, b);
        System.out.println("Result of add method: " + result);

        //8. Nested classes.
        OuterClass outer = new OuterClass();
        OuterClass.InnerClass inner = outer.new InnerClass();
        inner.innerMethod();

        //9. StringBuilder
        StringBuilder sb = new StringBuilder();
        sb.append("Hello");
        sb.append(", ");
        sb.append("World!");
        System.out.println(sb.toString());

        //10. ternary operator
        String evenOrOdd = (a % 2 == 0) ? "even" : "odd";
        System.out.println("a is " + evenOrOdd);
    }

    public static int add(int x, int y) {
        return x + y;
    }

    static class OuterClass {
        private int outerVariable = 100;
        class InnerClass {
            public void innerMethod(){
                System.out.println("inner method, outer variable: " + outerVariable);
            }
        }
    }
}