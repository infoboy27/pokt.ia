import React from "react"
import classes from "./POKTLogo.module.css"

type POKTLogoProps = {
  icon?: boolean
}

function POKTLogo({ icon }: POKTLogoProps) {
  return icon ? (
    <svg
      fill="none"
      height="28"
      viewBox="0 0 28 28"
      width="28"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 4C8.48 4 4 8.48 4 14s4.48 10 10 10 10-4.48 10-10S19.52 4 14 4zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        fill="#D53F8C"
      />
      <path
        d="M14 8c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
        fill="#D53F8C"
      />
    </svg>
  ) : (
    <svg
      fill="none"
      height="28"
      viewBox="0 0 120 28"
      width="120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 4C8.48 4 4 8.48 4 14s4.48 10 10 10 10-4.48 10-10S19.52 4 14 4zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        fill="#D53F8C"
      />
      <path
        d="M14 8c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
        fill="#D53F8C"
      />
      <text x="35" y="18" fill="#D53F8C" fontSize="16" fontWeight="bold">
        POKT.ia
      </text>
    </svg>
  )
}

export default POKTLogo 