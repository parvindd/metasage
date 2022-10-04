// pages/index.js
import Head from "next/head";
import styles from "../styles/Home.module.css";
import {
  Amplify,
  Auth,
  AuthModeStrategyType,
  DataStore,
  withSSRContext,
} from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import { Post } from "../src/models";
import { serializeModel } from "@aws-amplify/datastore/ssr";
import awsExports from "../src/aws-exports";

Amplify.configure({
  ...awsExports,
  DataStore: {
    authModeStrategyType: AuthModeStrategyType.MULTI_AUTH,
  },
  ssr: true,
});

export async function getServerSideProps({ req }) {
  const SSR = withSSRContext({ req });
  const posts = await SSR.DataStore.query(Post);

  return {
    props: {
      // 👇 This converts Post instances into serialized JSON for the client
      posts: serializeModel(posts),
    },
  };
}

async function handleCreatePost(event) {
  event.preventDefault();

  const form = new FormData(event.target);

  try {
    const post = await DataStore.save(
      new Post({
        title: form.get("title"),
        content: form.get("content"),
      })
    );

    window.location.href = `/posts/${post.id}`;
  } catch (error) {
    console.log(error);
  }
}

export default function Home({ posts = [] }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Amplify DataStore + Next.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Amplify DataStore + Next.js</h1>
        <p className={styles.description}>
          <code className={styles.code}>{posts.length}</code>
          posts
        </p>

        <div className={styles.grid}>
          {posts.map((post) => (
            <a className={styles.card} href={`/posts/${post.id}`} key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </a>
          ))}

          <div className={styles.card}>
            <h3 className={styles.title}>New Post</h3>

            <Authenticator>
              <form onSubmit={handleCreatePost}>
                <fieldset>
                  <legend>Title</legend>
                  <input
                    defaultValue={`Today, ${new Date().toLocaleTimeString()}`}
                    name="title"
                  />
                </fieldset>

                <fieldset>
                  <legend>Content</legend>
                  <textarea
                    defaultValue="I built an Amplify app with Next.js and DataStore!"
                    name="content"
                  />
                </fieldset>

                <button>Create Post</button>
                <button type="button" onClick={() => Auth.signOut()}>
                  Sign out
                </button>
              </form>
            </Authenticator>
          </div>
        </div>
      </main>
    </div>
  );
}