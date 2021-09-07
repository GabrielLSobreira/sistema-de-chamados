import { FiX } from 'react-icons/fi';
import './styles.css';

const Modal = ({ conteudo, close }) => {
  return (
    <div className="modal">
      <div className="container">
        <button className="close" onClick={close}>
          <FiX size={23} color="#FFF" />
          Voltar
        </button>
        <div>
          <h2>Detalhes do chamado</h2>
          <div className="row">
            <strong>Cliente: </strong>
            <span>{conteudo.cliente}</span>
          </div>
          <div className="row items">
            <strong>Assunto:</strong>
            <span>{conteudo.assunto}</span>
            <div>
              <strong>Cadastrado em:</strong>
              <span>{conteudo.createdFormated}</span>
            </div>
          </div>
          <div className="row">
            <strong>Status: </strong>
            <span
              style={{
                color: '#fff',
                backgroundColor:
                  conteudo.status === 'Aberto' ? '#5cb85c' : '#999',
              }}
            >
              {conteudo.status}
            </span>
          </div>
          {conteudo.complemento !== '' && (
            <>
              <h3>Complemento: </h3>
              <p>{conteudo.complemento}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
