// index.tsx
import React from 'react';
import Menu from '../components/Menu';
import PlayArea from '../components/PlayArea';

const IndexPage = () => {
  return (
    <div>
      <Menu />
      <div className="banner">
        <p>AvaCoqChi 🐣 🐥 🐔 </p>
      </div>
      <PlayArea />

    </div>
  );
};

export default IndexPage;
