import { useCallback, useEffect, useState } from "react";
import { useClipboard } from "use-clipboard-copy";

import Layout from "../components/Layout";

import styles from "../styles/Home.module.css";

export default function Home() {
  const clipboard = useClipboard();

  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [senderName, setSenderName] = useState("");

  const [linkToCopy, setLinkToCopy] = useState("");
  const [isLinkCopied, setLinkCopied] = useState(false); // holds temporarily whether or not the link was copied

  // workaround such that SSR does not try to
  // access window, which does not exist in
  // the server-side context
  useEffect(() => {
    setLinkToCopy(
      window.location.protocol +
        "//" +
        window.location.host +
        "/story/" +
        slugify(headline.toLowerCase()) +
        "/" +
        slugify(description) +
        // adds sender name if applicable
        (senderName && senderName !== ""
          ? "?ref=" + encodeURIComponent(btoa(senderName))
          : "")
    );
  }, [headline, description, senderName]);

  const copyLinkToClipboard = useCallback(() => {
    if (headline !== "" && description !== "") {
      // functionality handled automatically by
      clipboard.copy();

      // show visually that link has been copied, then revert state after 1 sec
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1000);
    } else {
      alert("Form incomplete; please fill it out to continue");
    }
  }, [headline, description, setLinkCopied]);

  return (
    <Layout>
      <div className="app-padded-container">
        <h1 className="logoText">BreakingNews</h1>
        <p className={styles.subtitle}>
          Write a compelling news headline to Coconut Mall your friends!
        </p>
        <NewsGeneratorInput
          type="text"
          value={headline}
          onValueChange={setHeadline}
          placeholder="Headline"
        />
        <NewsGeneratorInput
          type="text"
          value={description}
          onValueChange={setDescription}
          placeholder="Description"
        />
        <NewsGeneratorInput
          type="text"
          value={senderName}
          onValueChange={setSenderName}
          placeholder="Sender Name (optional)"
        />
        <button
          onClick={copyLinkToClipboard}
          className={styles.createButton}
          // ref={copyButtonRef}
        >
          {isLinkCopied ? "Copied!" : "Copy Link"}
        </button>
      </div>
      <form>
        <input
          className={styles.copyTextInput}
          ref={clipboard.target}
          value={linkToCopy}
          contentEditable={true}
          readOnly={false}
          onChange={(e) => e.preventDefault()}
          // on purpose
          suppressContentEditableWarning={true}
        />
      </form>
    </Layout>
  );
}

const slugify = (text) => encodeURIComponent(text.replace(/ /g, "-"));

function NewsGeneratorInput({ onValueChange, ...props }) {
  return (
    <input
      className={styles.newsGeneratorInput}
      onChange={(e) => onValueChange(e.target.value)}
      {...props}
    />
  );
}
