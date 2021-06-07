import Head from 'next/head';
import buildClient from '../api/build-client';

const Home = ({ currentUser }) => {
  return (
    <div>
      <Head>
        <title>Ticketing Client Q!</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div>
        {currentUser ? (
          <h1>Ticketing Landing Page</h1>
        ) : (
          <h1>You are not signed in.</h1>
        )}
      </div>
    </div>
  );
};

Home.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');
  return data;
};

export default Home;
