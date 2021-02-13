import { useCallback, useRef, useState } from "react";
import Layout from "../../../components/Layout";

// hooks
import useWindowDimensions from "../../../hooks/useWindowDimensions";

// styles
import styles from "../../../styles/StoryView.module.css";

export default function StoryView({ headline, description /*, name*/ }) {
  const [playingVideo, setPlayingVideo] = useState(false);
  const videoRef = useRef(null);
  const { width, height } = useWindowDimensions();

  const startVideo = useCallback(() => {
    setPlayingVideo(true);
    document.body.style.background = "#000"; // set background color to black
    videoRef.current.play();
  }, [setPlayingVideo, videoRef]);

  return (
    <Layout
      overrideOGPTitle={`BREAKING: ${headline}`}
      title={headline}
      description={description}
    >
      <div className="app-padded-container" hidden={playingVideo}>
        <div className={styles.logoText}>BreakingNews</div>
        <h1 className={styles.heading}>{headline}</h1>
        <p className={styles.subtitle}>{description}</p>
        <ButtonsContainer>
          <StoryButton onClick={startVideo} className={styles.openBtn}>
            Open
          </StoryButton>
          <StoryButton onClick={startVideo} className={styles.saveForLater}>
            Save for Later
          </StoryButton>
        </ButtonsContainer>
      </div>
      <video
        aria-hidden={!playingVideo}
        hidden={!playingVideo}
        ref={videoRef}
        playsInline={true}
        controls={false}
        style={{ width, height }}
      >
        <source src="/CoconutMalled.mp4" type="video/mp4" />
      </video>
    </Layout>
  );
}

function StoryButton({ onClick, children, className }) {
  return (
    <button
      className={styles.storyButton + (className ? " " + className : "")}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ButtonsContainer({ children }) {
  return (
    <div className={styles.storyButtonContainer}>
      <div className={styles.inner}>{children}</div>
    </div>
  );
}

export const getServerSideProps = async ({ params, query }) => {
  const headline = convertSlugToHeadline(params.slug);
  const description = formatDescription(params.description);
  const name =
    query?.ref && query.ref !== "" && /[A-Za-z0-9+/=]/.test(query.ref)
      ? Buffer.from(query.ref, "base64").toString()
      : null;

  return {
    props: { headline, description, name },
  };
};

const capitalize = (word) => word.charAt(0).toUpperCase() + word.substring(1);
const convertSlugToHeadline = (slug) =>
  slug
    .split("-")
    .map((word) => capitalize(word))
    .join(" ");

// capitalize first word and then leave the rest unaltered
const formatDescription = (descriptionSlug) => {
  const descriptionSplit = descriptionSlug.split("-");
  return [capitalize(descriptionSplit[0]), ...descriptionSplit.slice(1)].join(
    " "
  );
};

// const generateDefaultDescription = (headline) =>
//   `BREAKING NEWS: ${headline}. See it now on BreaklngNews.live`;
