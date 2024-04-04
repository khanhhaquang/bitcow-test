import React from 'react';

interface IProps {
  children: React.ReactNode;
}
const Title: React.FC<IProps> = ({ children }) => {
  return <div className="w-60">{children}</div>;
};
export default Title;
