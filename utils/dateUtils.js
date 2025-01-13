

const formatDate = (date) => {
  const date2 = new Date(date);
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'America/Argentina/Buenos_Aires' }; // Cambia la zona horaria si es necesario
  return date2.toLocaleDateString('es-ES', options);
};

 const formatddmmyyyy = (date) => {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};
   function obtenerFechaHora(createdAt) {
    const opciones = {
      weekday: 'long',   // Nombre completo del día
      day: 'numeric',    // Número del día
      month: 'long',     // Nombre completo del mes
      year: 'numeric',   // Año completo
      hour: '2-digit',   // Hora con 2 dígitos
      minute: '2-digit', // Minutos con 2 dígitos
      hour12: true       // AM/PM
    };
  
    const fecha = new Date(createdAt);
    const fechaFormateada = fecha.toLocaleString('es-ES', opciones);
    //fechaFormateada.replace(",", "")
    // Cambiar la coma por "a las" para que quede en el formato deseado
    let text1 = fechaFormateada.replace(",", " ")
     text1 = text1.replace(",", " a las ")
    return  text1;
  }

  module.exports = {
    formatDate,
    obtenerFechaHora,
    formatddmmyyyy
  };