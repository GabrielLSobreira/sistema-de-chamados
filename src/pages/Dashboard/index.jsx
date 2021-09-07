import { useContext, useEffect, useState } from 'react';
import {
  FiEdit2,
  FiMessageSquare,
  FiPlus,
  FiSearch,
  FiTrash,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Title from '../../components/Title';
import './styles.css';
import firebase from '../../services/firebaseConnection';
import { format } from 'date-fns';
import Modal from '../../components/Modal';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/auth';

const listRef = firebase
  .firestore()
  .collection('chamados')
  .orderBy('created', 'desc');

const Dashboard = () => {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [lastDocs, setLastDocs] = useState();
  const [showPostModal, setShowPostModal] = useState(false);
  const [datail, setDetail] = useState();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function loadChamados() {
      await listRef
        .limit(5)
        .get()
        .then((snapshot) => {
          updateState(snapshot);
        })
        .catch((err) => {
          setLoadingMore(false);
        });

      setLoading(false);
    }
    loadChamados();
  }, []);

  async function updateState(snapshot) {
    const isCollectionEmpty = snapshot.size === 0;
    if (!isCollectionEmpty) {
      let lista = [];
      snapshot.forEach((doc) => {
        doc.data().userId === user.uid &&
          lista.push({
            id: doc.id,
            assunto: doc.data().assunto,
            cliente: doc.data().cliente,
            clienteId: doc.data().clienteId,
            created: doc.data().created,
            createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
            status: doc.data().status,
            complemento: doc.data().complemento,
          });
      });
      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
      setChamados((chamados) => [...chamados, ...lista]);
      setLastDocs(lastDoc);
    } else {
      setIsEmpty(true);
    }

    setLoadingMore(false);
  }

  async function handleMore() {
    setLoadingMore(true);
    await listRef
      .startAfter(lastDocs)
      .limit(5)
      .get()
      .then((snapshot) => {
        updateState(snapshot);
      });
  }

  function togglePostModal(item) {
    setShowPostModal(!showPostModal);
    setDetail(item);
  }

  async function handleDelete(id) {
    firebase
      .firestore()
      .collection('chamados')
      .doc(id)
      .delete()
      .then(() =>
        toast.info('Chamado excluído com sucesso!', { theme: 'colored' }),
      );
    setChamados(chamados.filter((item) => item.id !== id));
  }

  if (loading)
    return (
      <div>
        <Header />
        <div className="content">
          <Title name="Atendimentos">
            <FiMessageSquare size={25} />
          </Title>
          <div className="container dashboard">
            <span>Buscando chamados...</span>
          </div>
        </div>
      </div>
    );
  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Atendimentos">
          <FiMessageSquare size={25} />
        </Title>
        {chamados.length === 0 ? (
          <div className="container dashboard">
            <span>Nenhum chamado registrado...</span>
            <Link to="/new" className="new">
              <FiPlus size={25} color="#FFF" />
              Novo chamado
            </Link>
          </div>
        ) : (
          <>
            <Link to="/new" className="new">
              <FiPlus size={25} color="#FFF" />
              Novo chamado
            </Link>
            <table>
              <thead>
                <tr>
                  <th scope="col">Cliente</th>
                  <th scope="col">Assunto</th>
                  <th scope="col">Status</th>
                  <th scope="col">Cadastrado em</th>
                  <th scope="col">#</th>
                </tr>
              </thead>
              <tbody>
                {chamados.map((item, index) => (
                  <tr key={index}>
                    <td data-label="Cliente">{item.cliente}</td>
                    <td data-label="Assunto">{item.assunto}</td>
                    <td data-label="Status">
                      <span
                        className="badge"
                        style={{
                          backgroundColor:
                            item.status === 'Aberto' ? '#5cb85c' : '#999',
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td data-label="Cadastrado">{item.createdFormated}</td>
                    <td data-label="#">
                      <button
                        className="action"
                        style={{ backgroundColor: '#3583F6' }}
                        onClick={() => togglePostModal(item)}
                      >
                        <FiSearch color="#FFF" size={17} />
                      </button>
                      <Link
                        to={`/new/${item.id}`}
                        className="action"
                        style={{ backgroundColor: '#F6a935' }}
                      >
                        <FiEdit2 color="#FFF" size={17} />
                      </Link>
                      <button
                        className="action"
                        style={{ backgroundColor: 'red' }}
                        onClick={() => handleDelete(item.id)}
                      >
                        <FiTrash color="#FFF" size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loadingMore && (
              <h3 style={{ textAlign: 'center', marginTop: 15 }}>
                Buscando dados...
              </h3>
            )}
            {!loadingMore && !isEmpty && (
              <button className="btn-more" onClick={handleMore}>
                Buscar mais
              </button>
            )}
          </>
        )}
      </div>
      {showPostModal && <Modal conteudo={datail} close={togglePostModal} />}
    </div>
  );
};

export default Dashboard;
