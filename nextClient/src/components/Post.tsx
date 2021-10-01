import { useEffect } from "react";
import createHash from "hash-generator";

import styles from "./Post.module.css";

interface Props {
  id: string;
  identicon: string;
}

const Post = ({ id, identicon }: Props) => {
  const icon = `data:image/png;base64,${identicon}`;

  // useEffect(() => {
  //   setTimeout(() => {
  //     document.location.href = `/posts/${createHash(15)}`;
  //   }, 150);
  // }, [id]);

  return (
    <div className={styles.container}>
      <p className={styles.hash}>{id}</p>
      <img className={styles.icon} src={icon} alt="icon" />
    </div>
  );
};

export default Post;
