import React, { useContext, useEffect, useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import Header from '../../components/Header';
import Title from '../../components/Title';
import { AuthContext } from '../../contexts/auth';
import './styles.css';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router';

const New = () => {
  const { id } = useParams();
  const history = useHistory();
  const [customers, setCustomers] = useState([]);
  const [loadCustomers, setLoadCustomers] = useState(true);
  const [customerSelected, setCustomerSelected] = useState(0);
  const [noCustomers, setNoCustomers] = useState(false);
  const [assunto, setAssunto] = useState('Suporte');
  const [status, setStatus] = useState('Aberto');
  const [complemento, setComplemento] = useState('');
  const { user } = useContext(AuthContext);
  const [idCustomer, setIdCustomer] = useState(false);

  useEffect(() => {
    async function loadCustomers() {
      await firebase
        .firestore()
        .collection('customers')
        .get()
        .then((snapshot) => {
          let lista = [];
          snapshot.forEach((doc) => {
            doc.data().userCustomer === user.uid &&
              lista.push({
                id: doc.id,
                nomeFantasia: doc.data().nomeFantasia,
                userCustomer: doc.data().userCustomer,
              });
            console.log(lista);
          });

          if (lista.length === 0) {
            setCustomers([
              { id: 1, nomeFantasia: 'Nenhum cliente cadastrado...' },
            ]);
            setLoadCustomers(false);
            setNoCustomers(true);
            return;
          }
          setCustomers(lista);
          setLoadCustomers(false);
          setNoCustomers(false);
          if (id) {
            async function loadId() {
              await firebase
                .firestore()
                .collection('chamados')
                .doc(id)
                .get()
                .then((snapshot) => {
                  setAssunto(snapshot.data().assunto);
                  setStatus(snapshot.data().status);
                  setComplemento(snapshot.data().complemento);

                  let index = lista.findIndex(
                    (item) => item.id === snapshot.data().clienteID,
                  );
                  setCustomerSelected(index);
                  setIdCustomer(true);
                })
                .catch((err) => setIdCustomer(false));
            }
            loadId();
          }
        })

        .catch((error) => {
          setLoadCustomers(false);
          setCustomers([{ id: 1, nomeFantasia: '' }]);
        });
    }
    loadCustomers();
  }, [id, user.uid]);

  async function handleRegister(e) {
    e.preventDefault();
    if (noCustomers) {
      toast.error('É necessário o cadastro de pelo menos um cliente!', {
        theme: 'colored',
      });
      history.push('/customers');
      return;
    }
    if (idCustomer) {
      await firebase
        .firestore()
        .collection('chamados')
        .doc(id)
        .update({
          cliente: customers[customerSelected].nomeFantasia,
          clienteID: customers[customerSelected].id,
          assunto: assunto,
          status: status,
          complemento: complemento,
          userId: user.uid,
        })
        .then(() => {
          toast.success('Chamado editado com sucesso!', { theme: 'colored' });
          setCustomerSelected(0);
          setComplemento('');
          history.push('/dashboard');
        })
        .catch((err) => {
          toast.error('Ops erro ao registrar, tente mais tarde.', {
            theme: 'colored',
          });
        });
      return;
    }
    await firebase
      .firestore()
      .collection('chamados')
      .add({
        created: new Date(),
        cliente: customers[customerSelected].nomeFantasia,
        clienteID: customers[customerSelected].id,
        assunto: assunto,
        status: status,
        complemento: complemento,
        userId: user.uid,
      })
      .then(() => {
        toast.success('Chamado criado com sucesso!', { theme: 'colored' });
        setComplemento('');
        setCustomerSelected(0);
      })
      .catch((err) => {
        toast.error('Ops erro ao registrar, tente mais tarde', {
          theme: 'colored',
        });
      });
  }

  function handleChangeSelect(e) {
    setAssunto(e.target.value);
  }

  function handleOptionChange(e) {
    setStatus(e.target.value);
  }

  function handleChangeCustomers(e) {
    setCustomerSelected(e.target.value);
  }
  return (
    <div>
      <Header />
      <div className="content">
        <Title name={!idCustomer ? 'Novo chamado' : 'Editar chamado'}>
          <FiPlusCircle size={25} />
        </Title>
        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Cliente</label>
            {loadCustomers ? (
              <input
                type="text"
                disabled={true}
                value="Carregando clientes..."
              />
            ) : (
              <select value={customerSelected} onChange={handleChangeCustomers}>
                {customers.map((item, index) => {
                  return (
                    <option
                      key={item.id}
                      value={index}
                      disabled={idCustomer || noCustomers}
                    >
                      {item.nomeFantasia}
                    </option>
                  );
                })}
              </select>
            )}

            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita Técnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>
            <label>Status</label>
            <div className="status">
              <input
                type="radio"
                name="radio"
                value="Aberto"
                onChange={handleOptionChange}
                checked={status === 'Aberto'}
              />
              <span>Aberto</span>
              <input
                type="radio"
                name="radio"
                value="Progresso"
                onChange={handleOptionChange}
                checked={status === 'Progresso'}
              />
              <span>Progresso</span>
              <input
                type="radio"
                name="radio"
                value="Atendido"
                onChange={handleOptionChange}
                checked={status === 'Atendido'}
              />
              <span>Atendido</span>
            </div>
            <label>Complemento</label>
            <textarea
              type="texte"
              placeholder="Descreva o problema (opcional)."
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            ></textarea>
            <button type="submit">{idCustomer ? 'Editar' : 'Registrar'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default New;
