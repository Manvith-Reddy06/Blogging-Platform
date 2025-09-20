import React from "react";
import Auth from "../components/Auth";
import { useOutletContext } from "react-router-dom";

export default function Home() {
  const { session } = useOutletContext();

  return (
    <>
      <h1>Blogging Platform</h1>
      <Auth session={session} />
    </>
  );
}