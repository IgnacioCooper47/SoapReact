import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [action, setAction] = useState('');
  const [formData, setFormData] = useState({});
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const xmlRequest = generateXmlRequest(action, formData);
      const res = await axios.post('http://localhost:8080/ws', xmlRequest, {
        headers: {
          'Content-Type': 'text/xml',
        },
      });
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(res.data, 'application/xml');
      setResponse(xmlDoc);
    } catch (error) {
      console.error('Network Error:', error);
    }
  };

  const generateXmlRequest = (action, data) => {
    if (action === 'addVehicle') {
      return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://springbootsoap.com/soap">
                <soapenv:Header/>
                <soapenv:Body>
                    <web:addVehicleRequest>
                        <web:vehicle>
                            <web:brand>${data.brand}</web:brand>
                            <web:model>${data.model}</web:model>
                            <web:color>${data.color}</web:color>
                        </web:vehicle>
                    </web:addVehicleRequest>
                </soapenv:Body>
            </soapenv:Envelope>`;
    } else if (action === 'searchVehicleByBrand') {
      return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://springbootsoap.com/soap">
                <soapenv:Header/>
                <soapenv:Body>
                    <web:searchVehicleByBrandRequest>
                        <web:brand>${data.brand}</web:brand>
                    </web:searchVehicleByBrandRequest>
                </soapenv:Body>
            </soapenv:Envelope>`;
    } else if (action === 'listVehicles') {
      return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://springbootsoap.com/soap">
                <soapenv:Header/>
                <soapenv:Body>
                    <web:listVehiclesRequest/>
                </soapenv:Body>
            </soapenv:Envelope>`;
    }
    return '';
  };

  const renderResponse = () => {
    if (!response) return null;

    if (action === 'addVehicle') {
      const statusElement = response.getElementsByTagName('ns2:status')[0];
      const status = statusElement ? statusElement.textContent : 'No status found';
      return <div>Status: {status}</div>;
    } else if (action === 'searchVehicleByBrand' || action === 'listVehicles') {
      const vehicles = response.getElementsByTagName('ns2:vehicles');
      if (vehicles.length === 0) {
        return <div>No vehicles found</div>;
      }
      return (
          <div>
            <h2>Vehicles:</h2>
            <ul>
              {Array.from(vehicles).map((vehicle, index) => {
                const brandElement = vehicle.getElementsByTagName('ns2:brand')[0];
                const modelElement = vehicle.getElementsByTagName('ns2:model')[0];
                const colorElement = vehicle.getElementsByTagName('ns2:color')[0];
                const brand = brandElement ? brandElement.textContent : 'Unknown';
                const model = modelElement ? modelElement.textContent : 'Unknown';
                const color = colorElement ? colorElement.textContent : 'Unknown';
                return (
                    <li key={index}>
                      Brand: {brand}, Model: {model}, Color: {color}
                    </li>
                );
              })}
            </ul>
          </div>
      );
    }
  };

  return (
      <div>
        <h1>Gestión de Vehículos SOAP</h1>
        <select onChange={(e) => setAction(e.target.value)}>
          <option value="">Selecciona una acción</option>
          <option value="addVehicle">Agregar Vehículo</option>
          <option value="searchVehicleByBrand">Buscar Vehículo por Marca</option>
          <option value="listVehicles">Listar Todos los Vehículos</option>
        </select>

        {action === 'addVehicle' && (
            <form onSubmit={handleSubmit}>
              <input name="brand" placeholder="Marca" onChange={handleChange} />
              <input name="model" placeholder="Modelo" onChange={handleChange} />
              <input name="color" placeholder="Color" onChange={handleChange} />
              <button type="submit">Enviar</button>
            </form>
        )}

        {action === 'searchVehicleByBrand' && (
            <form onSubmit={handleSubmit}>
              <input name="brand" placeholder="Marca" onChange={handleChange} />
              <button type="submit">Buscar</button>
            </form>
        )}

        {action === 'listVehicles' && (
            <form onSubmit={handleSubmit}>
              <button type="submit">Listar Vehículos</button>
            </form>
        )}

        {response && (
            <div>
              <h2>Respuesta del Servidor</h2>
              {renderResponse()}
            </div>
        )}
      </div>
  );
}

export default App;