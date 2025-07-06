async function traerEstudiantes() {
    let id = getIdBusqueda()
    let response
    console.log(id)
    //Si el usuario no ingreso nada en el id el valor del input va a estar vacio
    if (id != "") {
        //Si quiero mandar un parametro es igual a mandarlo en la query como haciamos antes
        response = await fetch(`http://localhost:4000/students?id=${id}`,{
            method:"GET", //GET, POST, PUT o DELETE
            headers: {
                "Content-Type": "application/json",
              },
        })
    } else {
        response = await fetch('http://localhost:4000/students',{
            method:"GET", //GET, POST, PUT o DELETE
            headers: {
                "Content-Type": "application/json",
              },
        })
    }
    //El response me imprime el JSON no tiene utilidad real
    console.log(response)
    //Desarmo el JSON y pasa a ser un objeto
    let result = await response.json()
    console.log(result)
}
//Estos tienen que ser un objeto!!!
async function agregarEstudiante(datos) {
    response = await fetch(`http://localhost:4000/students`,{
        method:"POST", //GET, POST, PUT o DELETE
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify(datos) //JSON.stringify me convierte de objeto a JSON
    })
    //El response me imprime el JSON no tiene utilidad real
    console.log(response)
    //Desarmo el JSON y pasa a ser un objeto
    let result = await response.json()
    console.log(result)
}

function obtenerDatos() {
    //Los parametros del objeto tienen que coincidir con los parametros que espera el back
    let datos = {
        id: getId(),
        FirstName : getNombre(),
        LastName: getApellido(),
        mail: getMail(),
        id_grade: getCurso()
    }
    agregarEstudiante(datos)
}