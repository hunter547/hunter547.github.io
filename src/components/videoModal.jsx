import React, { useEffect, useState } from "react";
import Modal from "react-modal";
// react-spinners is dual-published: the bundler resolves its ESM build (named
// exports, no default) while the SSG pre-render loads the CommonJS build
// (default = module.exports, named bindings unavailable). Namespace-import and
// pick SyncLoader from whichever shape we get so both paths resolve.
import * as ReactSpinners from "react-spinners";
import "../styles/components/videoModal.scss";

const { SyncLoader } = ReactSpinners.default ?? ReactSpinners;

// Spinner shown while the embedded video iframe loads.
const spinnerOverride = {
  display: "block",
  position: "fixed",
  top: "50%",
  left: "50%",
  right: "auto",
  bottom: "auto",
  marginRight: "-50%",
  margin: "auto",
  transform: "translate(-50%, -50%)",
  borderColor: "#023440",
};

// Controlled video lightbox shared by the portfolio grid and the niche pages.
// Renders nothing without a `video` ({ URL, title }); the iframe only mounts
// while open, keeping it out of the static pre-render.
const VideoModal = ({ video, isOpen, onRequestClose }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof document !== "undefined") Modal.setAppElement("body");
  }, []);

  // Reset the spinner each time the modal is opened.
  useEffect(() => {
    if (isOpen) setLoading(true);
  }, [isOpen]);

  // Stay unmounted until opened so react-modal never renders during the
  // static pre-render (matching the portfolio grid's original behavior).
  if (!video || !isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={video.title || "Demo video"}
      className="portfolio__item-modal"
    >
      <SyncLoader cssOverride={spinnerOverride} color={"#023440"} loading={loading} />
      <div className="video">
        <iframe
          src={video.URL}
          title={video.title}
          className="embeded-video"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          onLoad={() => setLoading(false)}
        />
      </div>
    </Modal>
  );
};

export default VideoModal;
