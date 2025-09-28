import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import styles from "./privacy.module.css";

export const dynamic = "force-static";

export default function PrivacyPage() {
    const filePath = path.join(process.cwd(), "PRIVACY.md");
    const content = fs.readFileSync(filePath, "utf-8");

    return (
        <main className={styles.container}>
            <article className={styles.markdown}>
                <ReactMarkdown>
                    {content}
                </ReactMarkdown>
            </article>

            <Link href="/">Return to dashboard.</Link>
        </main>
    );
}
