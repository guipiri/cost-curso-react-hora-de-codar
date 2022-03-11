import styles from "./Project.module.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../layout/Loading";
import Message from "../layout/Message";
import Container from "../layout/Container";
import ProjectForm from "../project/ProjectForm";
import ServiceForm from "../service/ServiceForm";
import ServiceCard from "../service/ServiceCard";
import { v4 as uuidv4 } from "uuid";

function Project() {
  const { id } = useParams();
  const [project, setProject] = useState([]);
  const [services, setServices] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [message, setMessage] = useState();
  const [type, setType] = useState();

  useEffect(() => {
    fetch(`http://localhost:5000/projects/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data);
        setServices(data.services);
      })
      .catch();
  }, [id]);

  function editPost(project) {
    if (project.budget < project.cost) {
      setType("error");
      setMessage("Custo maior que orçamento!");
      return false;
    }

    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data);
        setShowProjectForm(false);
        setType("success");
        setMessage("Projeto alterado com sucesso!");
      })
      .catch((err) => console.log(err));
  }

  function createService(project) {
    setMessage("");
    const lastService = project.services[project.services.length - 1];
    lastService.id = uuidv4();
    const lastCost = lastService.cost;
    const newCost = parseFloat(lastCost) + parseFloat(project.cost);

    if (newCost > project.budget) {
      project.services.pop();
      setType("error");
      setMessage("Orçamento estourado!");
      return false;
    }

    project.cost = newCost;

    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        // setProject(data);
        setServices(data.services);
        setType("success");
        setMessage("Serviço adicionado");
        setShowServiceForm(false);
      })
      .catch((err) => console.log(err));
  }

  function removeService(id, cost) {
    setMessage("");

    const servicesUpdated = project.services.filter(
      (service) => service.id !== id
    );

    const projectUpdated = {
      ...project,
      services: servicesUpdated,
      cost: project.cost - cost,
    };

    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectUpdated),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data);
        setType("success");
        setMessage("Serviço removido");
        setServices(servicesUpdated);
      })
      .catch((err) => console.log(err));
  }

  function toggleProjectForm() {
    setShowProjectForm(!showProjectForm);
  }
  function toggleServiceForm() {
    setShowServiceForm(!showServiceForm);
  }

  return (
    <>
      {project.name ? (
        <div className={styles.project_details}>
          {message && <Message type={type} msg={message} />}
          <div className={styles.details_container}>
            <h1>Projeto: {project.name}</h1>
            <button className={styles.btn} onClick={toggleProjectForm}>
              {!showProjectForm ? "Editar" : "Fechar"}
            </button>
            {!showProjectForm ? (
              <div className={styles.form_info}>
                <p>
                  <span>Categoria: </span>
                  {project.category.name}
                </p>
                <p>
                  <span>Total de orçamento: </span>
                  R$ {project.budget}
                </p>
                <p>
                  <span>Total utilizado: </span>
                  R$ {project.cost}
                </p>
              </div>
            ) : (
              <div className={styles.form_info}>
                <ProjectForm
                  handleSubmit={editPost}
                  btnText="Concluir edição"
                  projectData={project}
                />
              </div>
            )}
          </div>
          <div className={styles.service_form_container}>
            <h2>Adicione um serviço:</h2>
            <button className={styles.btn} onClick={toggleServiceForm}>
              {!showServiceForm ? "Adicionar serviço" : "Fechar"}
            </button>
            <div className={styles.form_info}>
              {showServiceForm && (
                <ServiceForm
                  handleSubmit={createService}
                  textBtn="Adicionar serviço"
                  projectData={project}
                />
              )}
            </div>
          </div>
          <h2>Serviços:</h2>
          <Container customClass="start">
            {services.length > 0 &&
              services.map((service) => (
                <ServiceCard
                  id={service.id}
                  name={service.name}
                  cost={service.cost}
                  description={service.description}
                  key={service.id}
                  handleRemove={removeService}
                />
              ))}
            {services.length === 0 && <p>Não há serviços cadastrados!</p>}
          </Container>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Project;
