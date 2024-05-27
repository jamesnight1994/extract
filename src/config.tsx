import React from "react";
import { Icon } from "@aws-amplify/ui-react";

import {
  MdDashboard,
  MdModeEditOutline,
  MdAccountBox,
  MdOutlineTableChart,
  MdUpload,
} from "react-icons/md";

export const baseConfig = {
  projectLink: "/", // GitHub link in the navbar
  docsRepositoryBase: "", // base URL for the docs repository
  titleSuffix: "",
  search: true,
  header: true,
  headerText: "Logo",
  footer: true,
  footerText: (
    <>
      <span>
        © MIT {new Date().getFullYear()}, Made with ❤️ by {"James"}
        <a href="https://github.com/jamesnight1994" target="_blank" rel="noreferrer">
        jamesnight1994
        </a>
      </span>
    </>
  ),

  logo: (
    <>
      <img
        src={process.env.PUBLIC_URL + "/logo.png"}
        alt="logo"
        width="30"
        height="22"
      />
    </>
  ),
};

/// Navigation sidebar
export const appNavs = [
  {
    eventKey: "dashboard",
    icon: <Icon as={MdDashboard} />,
    title: "Dashboard",
    to: "/",
  },

  {
    eventKey: "document",
    icon: <Icon as={MdUpload} />,
    title: "Document Upload",
    to: "/document",
  },
];
