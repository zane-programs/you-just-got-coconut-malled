import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/router";

import Layout from "../../../components/Layout";

// hooks
import useWindowDimensions from "../../../hooks/useWindowDimensions";

// styles
import styles from "../../../styles/StoryView.module.css";

const VideoState = Object.freeze({
  PreVideo: 1, // before video plays
  PlayingVideo: 2, // during video playtime
  FinishedPlaying: 3, // after video has played
});

export default function StoryView({ headline, description /*, name*/ }) {
  const [videoState, setVideoState] = useState(VideoState.PreVideo);
  const videoRef = useRef(null);
  const { width, height } = useWindowDimensions();

  const startVideo = useCallback(() => {
    setVideoState(VideoState.PlayingVideo);
    document.body.style.backgroundColor = "#000"; // set background color to black
    videoRef.current.play();
  }, [setVideoState, videoRef]);

  const handleVideoEnd = useCallback(() => {
    setVideoState(VideoState.FinishedPlaying);
    document.body.style.removeProperty("background-color");
  }, [setVideoState]);

  return (
    <Layout
      overrideOGPTitle={`BREAKING: ${headline}`}
      title={headline}
      description={description}
    >
      <div
        className="app-padded-container"
        aria-hidden={videoState !== VideoState.PreVideo}
        hidden={videoState !== VideoState.PreVideo}
      >
        <div className="logoText">BreakingNews</div>
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
        aria-hidden={videoState !== VideoState.PlayingVideo}
        hidden={videoState !== VideoState.PlayingVideo}
        ref={videoRef}
        playsInline={true}
        controls={false}
        style={{ width, height }}
        onEnded={handleVideoEnd}
      >
        <source src="/CoconutMalled.mp4" type="video/mp4" />
      </video>
      {videoState === 3 ? <PostVideoUpsell /> : null}
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

// shown after the video plays to suggest to the
// coconut-malled person that they prank someone else
function PostVideoUpsell() {
  const router = useRouter();

  return (
    <div className="app-padded-container">
      <h1 className="logoText">Coconut Malled!</h1>
      <p className={styles.subtitleLarge}>You just got Coconut Malled!</p>
      <p className={styles.subtitle}>
        Want to prank your friends, too? With our website, you can create a
        custom news headline to clickbait unsuspecting friends and
        acquaintances.
      </p>
      <StoryButton onClick={() => router.push("/")}>Create Your Own</StoryButton>
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
