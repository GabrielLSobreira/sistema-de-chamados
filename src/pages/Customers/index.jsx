import { useContext, useState } from 'react';
import { FiUser } from 'react-icons/fi';
import Header from '../../components/Header';
import Title from '../../components/Title';
import './styles.css';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import { AuthContext } from '../../contexts/auth';

const Customers = () => {
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const { user } = useContext(AuthContext);

  async function handleAdd(e) {
    e.preventDefault();
    if (nomeFantasia !== '' && cnpj !== '' && cnpj !== '') {
      await firebase
        .firestore()
        .collection('customers')
        .add({
          nomeFantasia: nomeFantasia,
          cnpj: cnpj,
          endereco: endereco,
          userCustomer: user.uid,
        })
        .then(() => {
          setNomeFantasia('');
          setCnpj('');
          setEndereco('');
          toast.info('Cliente cadastrado com sucesso!', { theme: 'colored' });
        })
        .catch(() => {
          toast.error('Erro ao cadastrar essa empresa', { theme: 'colored' });
        });
    } else {
      toast.error('Preencha todos os campos', { theme: 'colored' });
    }
  }
  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Clientes">
          <FiUser size={25} />
        </Title>
        <div className="container">
          <form className="customers" onSubmit={handleAdd}>
            <label>Nome Fantasia</label>
            <input
              type="text"
              placeholder="Nome da empresa"
              value={nomeFantasia}
              onChange={(e) => setNomeFantasia(e.target.value)}
            />
            <label>CNPJ</label>
            <input
              type="text"
              placeholder="CNPJ da empresa"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
            />
            <label>Endereço</label>
            <input
              type="text"
              placeholder="Endereço da empresa"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
            <button type="submit">Cadastrar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Customers;
