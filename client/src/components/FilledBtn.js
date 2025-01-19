import React from 'react';
import { Button, styled } from "@mui/material";

const CustomFilledBtn = styled(Button)(({height, width, fontSize, fontWeight, disabled}) => ({
  height: height || "47px",
  width: width || "auto",
  fontSize: fontSize || "16px",
  fontWeight: fontWeight || "600",
  backgroundColor: "#052f55",
  textTransform: "none",
  disabled: disabled,
}))

export default function FilledBtn({height, width, fontSize, fontWeight, text, onClick, disabled, ...rest}) {
  return (
    <CustomFilledBtn variant="contained" height={height} width={width} fontSize={fontSize} fontWeight={fontWeight} onClick={onClick} disabled={disabled} {...rest}>{text}</CustomFilledBtn>
  )
}
