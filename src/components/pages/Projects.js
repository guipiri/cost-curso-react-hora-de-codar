import { useLocation, useParams } from "react-router-dom";
import Message from "../layout/Message";
import styles from "./Projects.module.css";
import LinkButton from "../layout/LinkButton";
import ProjectCard from "../project/ProjectCard";
import { useEffect, useState } from "react";
import Loading from "../layout/Loading";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [message, setMessage] = useState("");

  const location = useLocation();

  useEffect(() => {
    fetch("http://localhost:5000/projects", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProjects(data);
        setRemoveLoading(true);
        if (location.state) {
          setMessage(location.state);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  function removeProject(id) {
    fetch(`http://localhost:5000/projects/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "aplication/json",
      },
    })
      .then(() => {
        setProjects(projects.filter((project) => project.id !== id));
        setMessage("Projeto removido com sucesso!");
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className={styles.container_projects}>
      <div className={styles.projects}>
        <h1>Meus Projetos</h1>
        <LinkButton to="/newproject" text="Criar Projeto" />
      </div>
      {message && <Message msg={message} type="success" />}
      <div className={styles.projects}>
        {projects.length > 0 &&
          projects.map((project) => (
            <ProjectCard
              name={project.name}
              id={project.id}
              budget={project.budget}
              category={project.category.name}
              key={project.id}
              handleRemove={removeProject}
            />
          ))}
        {!removeLoading && <Loading />}
        {removeLoading && projects.length === 0 && (
          <p>Você ainda não possui projetos!</p>
        )}
      </div>
    </div>
  );
}

export default Projects;
