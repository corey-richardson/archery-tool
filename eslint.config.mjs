import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import jsdocPlugin from "eslint-plugin-jsdoc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        rules: {
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
            "react/no-unescaped-entities": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "quotes": ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }],
            "indent": ["error", 4, { 
                SwitchCase: 1,
                VariableDeclarator: 1,
                outerIIFEBody: 1,
                FunctionDeclaration: { parameters: 1, body: 1 },
                FunctionExpression: { parameters: 1, body: 1 },
                CallExpression: { arguments: 1 },
                ArrayExpression: 1,
                ObjectExpression: 1,
                ImportDeclaration: 1,
                flatTernaryExpressions: false,
                ignoreComments: false
            }],
            "@typescript-eslint/indent": "off",
            "no-tabs": "error",
            "no-mixed-spaces-and-tabs": "error",
            "no-trailing-spaces": "error",
            "array-bracket-spacing": ["error", "always"],
        },
    },
    {
        files: ["src/app/api/**/route.ts"],
        plugins: { jsdoc: jsdocPlugin  },
        rules: {
            "jsdoc/no-missing-syntax": [
                "error",
                {
                    contexts: [
                        {
                            comment: "JsdocBlock:has(JsdocTag[tag=swagger])",
                            context: "any",
                            message: "@swagger documentation is required on each API. See https://github.com/jellydn/next-swagger-doc"
                        }
                    ]
                }
            ]
        }
    }
];

export default eslintConfig;
