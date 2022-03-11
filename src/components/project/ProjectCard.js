import React from "react";
import styles from "./ProjectCard.module.css";
import { BsPencil, BsFillTrashFill } from "react-icons/bs";
import { Link } from "react-router-dom";

function ProjectCard({ id, name, budget, category, handleRemove }) {
  const remove = (e) => {
    e.preventDefault();
    handleRemove(id);
  };

  return (
    <div className={styles.project_card}>
      <h4 title={name}>{name}</h4>
      <p>
        <span>Orçamento:</span> R$ {budget}
      </p>
      <p className={styles.category}>
        <span className={`${styles[category.toLowerCase()]}`}></span>
        {category}
      </p>
      <div className={styles.project_actions}>
        <Link to={`/project/${id}`}>
          <BsPencil />
          Editar
        </Link>
        <button onClick={remove}>
          <BsFillTrashFill />
          Remover
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;
