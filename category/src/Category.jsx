import React, { useEffect, useState } from 'react';
import './Category.scss';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Category = () => {
  const [categories, setCategories] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/categories');
      console.log(response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='category'>
      {categories.map(category => (
        <Cont
          key={category.id}
          id={category.id} // Pass the id to the Cont component
          name={category.name}
          photoUrl={category.photoUrl}
        />
      ))}
    </div>
  );
};

const Cont = ({ id, name, photoUrl }) => {
  return (
    <Link to={`/category/${id}`} className="cont">
      <img src={photoUrl} alt={name} />
      <h1>{name}</h1>
    </Link>
  );
};

export default Category;
