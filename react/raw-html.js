import React, {useEffect, useRef} from 'react';
import APIRequest from "../api/private/core/request";
import Router from "next/router";
import "blueprint-css/src/blueprint.scss"

const RawHtml = ({children, className = null, container = 'div'}) => {
  const containerRef = useRef();
  const props = {
    ref: containerRef,
  };

  const clickHandler = async function (e) {
    e.preventDefault();
    const host = process.env['ORIGIN'];
    const urlHost = e.target.origin;
    if (host === urlHost){
      const url = new URL(this.href);
      const request = new APIRequest();
      const response = await request.checkRedirect(url.pathname);
      Router.push(response.redirect);
    } else {
      Router.push(this.href);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      const containerEl = containerRef.current;

      const aEls = Array.from(containerEl.getElementsByTagName('a'));

      aEls.forEach((a) => {
        a.href.substr(0, 6) !== 'mailto' &&
        a.addEventListener('click', clickHandler);
      });
    }
  }, [ containerRef ]);

  if (children) {
    props.dangerouslySetInnerHTML = {
      __html: children,
    };
  }

  if (className) {
    props.className = className;
  }
  return React.createElement(container, props);
};

export default RawHtml;
