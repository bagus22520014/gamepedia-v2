import { createPortal } from 'react-dom';

const Portal = ({ children }) => {
  return createPortal(children, document.getElementById('portal-root'));
};

export default Portal;
