import {FC, useEffect, useState} from 'react';
import Backdrop from 'components/common/Backdrop';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import classes from './Styles.module.scss';
import CloseIcon from '@/icons/Toggle/close.svg';

interface IModalReducer {
  // eslint-disable-next-line no-unused-vars
  onClose: () => any,
  withCloseIcon?: boolean,
  items: [any]
  finalModal?: any,
  onFinish?: (any) => {},
}

const ModalReducer: FC<IModalReducer> = ({withCloseIcon, onClose, items, finalModal, onFinish}) => {
  const [activeModal, setActiveModal] = useState(0);
  const [finalModalStatus, setFinalModalStatus] = useState(false);
  const [reducerData, setReducerData] = useState([])
  const FinalBody = finalModal;
  let ActiveBody = items[activeModal];

  const closeModal = () => {
    onClose();
  };

  const nextBody = (data) => {
    if (finalModalStatus) return onClose();
    const newData = reducerData.slice()
    newData.push(data)
    setReducerData(newData)
    if (activeModal === items.length - 1) {
      onFinish(reducerData)
      !finalModal ? closeModal() : setFinalModalStatus(true)
    } else {
      setActiveModal(activeModal + 1)
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'visible';
    };
  });

  return (
    createPortal(
      <Backdrop>
        <div className={classes.modal}>
          {withCloseIcon && (
            <div
              tabIndex={0}
              role="button"
              onKeyDown={() => { }}
              onClick={closeModal}
              className={classes.modal__close}
            >
              <Image src={CloseIcon} alt="" width={24} height={24} />
            </div>
          )}
          {!finalModalStatus ? <ActiveBody onClose={data => {nextBody(data)}} data={reducerData}/> :
              <FinalBody onClose={data => {nextBody(data)}} data={reducerData}/>
          }
        </div>
      </Backdrop>,
      document.getElementById('modal-root'),
    )
  );
};

ModalReducer.defaultProps = {
  withCloseIcon: true,
};

export default ModalReducer;
