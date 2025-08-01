// import Prism from 'prismjs';
// import { useEffect } from 'react';
// import "prismjs/components/prism-javascript";
// import "prismjs/components/prism-jsx";
// import "prismjs/components/prism-typescript";
// import "prismjs/components/prism-tsx";
// import "prismjs/components/prism-json";
// import "prismjs/components/prism-markup";
// import "prismjs/components/prism-css";

import { useCurrentTheme } from "@/hooks/use-current-theme";
import Editor from "@monaco-editor/react";

// import "./code-theme.css"

interface Props {
    code: string;
    language?: string;
}

export const CodeView = ({ code, language }: Props) => {

    const currTheme = useCurrentTheme();
    console.log("Current theme:", currTheme);

    // useEffect(() => {
    //     Prism.highlightAll();
    // }, [code, language]);

    // return (
    //     <pre className='p-2 bg-transparent border-none rounded-none m-0 text-xs'>
    //         <code className={`language-${language}`}>
    //             {code}
    //         </code>
    //     </pre>
    // )

    return (
        <Editor
            height="100vh"
            defaultLanguage={language}
            defaultValue={code}
            theme={currTheme === "dark" ? "vs-dark" : "light"}
            onChange={(value) => {
                console.log("Code changed:", value);
            }}
        />
    )
}