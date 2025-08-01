import { useCurrentTheme } from "@/hooks/use-current-theme";
import Editor from "@monaco-editor/react";
import blackboardTheme from 'monaco-themes/themes/Blackboard.json';

interface Props {
    code: string;
    language?: string;
    onChange?: (value: string | undefined) => void;
}

export const CodeView = ({ code, language, onChange }: Props) => {

    const theme = useCurrentTheme();

    const handleEditorWillMount = (monaco: any) => {
        // Define the 'blackboard' theme for use in dark mode
        monaco.editor.defineTheme('blackboard', blackboardTheme);
    };

    return (
        <Editor
            height="100%"
            language={language}
            value={code}
            beforeMount={handleEditorWillMount}
            theme={theme === "dark" ? "blackboard" : "light"}
            onChange={onChange}
            options={{
                readOnly: false,
                domReadOnly: true,
                padding: {
                    top: 10,
                },
                minimap: {
                    enabled: false
                },
                autoClosingBrackets: "always",
                fontSize: 14,
                lineNumbers: "on",
                lineHeight: 24,
                scrollBeyondLastLine: false,
                wordWrap: "on",
                wrappingIndent: "indent",
                renderLineHighlight: "all",
                renderWhitespace: "none",
                contextmenu: true,
                overviewRulerBorder: false,
                overviewRulerLanes: 0,
                scrollbar: {
                    vertical: "hidden",
                    horizontal: "hidden",
                    useShadows: false,
                    alwaysConsumeMouseWheel: false,
                },
                glyphMargin: false,
                folding: false,
                foldingStrategy: "indentation",
                fixedOverflowWidgets: true,
                selectionHighlight: false,
                cursorBlinking: "smooth",
                cursorStyle: "line",
                cursorWidth: 2,
                accessibilitySupport: "off",
                tabSize: 2,
                insertSpaces: true,
                detectIndentation: false,
                renderLineHighlightOnlyWhenFocus: true,
                hideCursorInOverviewRuler: true,
                matchBrackets: "always",
                autoIndent: "full",
                suggestOnTriggerCharacters: true,
                quickSuggestions: {
                    other: true,
                    comments: false,
                    strings: true,
                },
                parameterHints: {
                    enabled: true,
                },
                formatOnType: true,
                formatOnPaste: true,
                links: false,
                codeLens: false,
                smoothScrolling: true,
            }}
        />
    )
}
