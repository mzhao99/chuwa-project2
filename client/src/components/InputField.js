import React, { useState } from "react";
import { TextField, styled, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const CustomizedInput = styled(TextField)(({ height, fontSize }) => ({
  height: height || "56px",
  "& .MuiInputBase-input": {
    fontSize: fontSize || "16px",
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "#5048E5",
    },
  },
}));

const InputField = React.forwardRef(({ height, fontSize, isPassword, onChange, name, value, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
      setShowPassword((show) => !show);
    };

    return (
      <CustomizedInput
        hiddenLabel
        fullWidth
        height={height}
        fontSize={fontSize}
        type={isPassword && !showPassword ? "password" : "text"}
        onChange={onChange}
        name={name}
        value={value}
        InputProps={{
          endAdornment: isPassword ? (
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showPassword ? "display the password" : "hide the password"
                }
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
        inputRef={ref} 
        {...props} 
      />
    );
  }
);

export default InputField;
