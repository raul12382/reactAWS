import {Button, Col, Form, Row, Select, message, Modal, Image} from "antd";
import React, { useState} from "react";
import axios from "axios";
const {Option} = Select;

const APIForm  = (props) => {
    const [form] = Form.useForm();
    const [imageFront, setImageFront] = useState("");
    const [imageBack, setImageBack] = useState('');
    const [information, setInformation] = useState({});
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('');
    const [dtype, setdtype] = useState(""); 
    const [tokenFront, setTokenFront] = useState("")
    const [tokenBack, setTokenBack] = useState("")
    const [tokenliveness, setTokenLiveness] = useState("")
    const [hidden, setHidden] = useState(false)
    const [viewDiv, setViewDiv] = useState(true)
    const [viewDiv1, setViewDiv1] = useState(true)
    const [viewDiv2, setViewDiv2] = useState(true)
    const [match, setMatch] = useState(null)
    
    const onChange = (value) =>{
        const a = value
        setdtype(a)
        setHidden(true)
        console.log(dtype)
    }
    const divAutocaptureBack = async (values) =>{
        const sessionId = await getSessionId();
        console.log('Session id', sessionId)
        const autocapture = window.TOCautocapture;
        const TOCautocapture = autocapture;

        TOCautocapture('container', {
            locale: "es",
            session_id: sessionId,
            document_type: dtype,
            document_side: "back",
            callback: function(captured_token, image){ 
            message.success('Captura Realizada', 3)
            const token = captured_token
            const image64 = image
            console.log(captured_token)   
            setTokenBack(token)
            setImageBack(image64)
            setViewDiv1(true)
            divLiveness()
        },
           failure: function(error){ message.error('Se ha generado el error: ' + error)},
           http: true
       }) 
    } 

    const divAutocaptureFront = async (values) =>{
        console.log(dtype)
        const sessionId = await getSessionId();
        console.log('Session id', sessionId)
        const autocapture = window.TOCautocapture;
        const TOCautocapture = autocapture;
        //uso de la funcion

        TOCautocapture('containerfront', {
            locale: "es",
            session_id: sessionId,
            document_type: dtype,
            document_side: "front",
            callback: function(captured_token, image){ 
            message.success('Captura Realizada', 3);
            console.log(image)  
            const imgFront = image 
            const tokenF = captured_token
            setTokenFront(tokenF)
            setImageFront(imgFront)
            setViewDiv(true)
            divAutocaptureBack()
        },
        failure: function(error){ message.error('Se ha generado el error: ' + error)} , 
        http: true,
        url_wsac : "https://prod-capture.tocws.com",
        url_lbac :  "https://prod-api.7oc.cl/auto-capture/data/v2"
    }) 
    } 

    const divLiveness = async (values) =>{
        const sessionId = await getSessionId();
        console.log('Session id', sessionId)
        const autocapture = window.TOCliveness ;
        const TOCliveness  = autocapture;

        TOCliveness ('liveness', {
        locale: "es",
        session_id: sessionId,
        callback: function(token){ 
        message.success('Captura Realizada', 3)
        const tl= token  
        setTokenLiveness(tl)
        setViewDiv2(true)
        },
        failure: function(error){ message.error('Se ha generado el error: ' + error)},
        http: true
    }) 
    } 

    const showModal = () => {
        setVisible(true);
    };
    const handleOk = () => {
        setModalText('El modal se cerrara en dos segundos');
        setConfirmLoading(true);
        setTimeout(() => {
            
          setVisible(false);
          setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };

    const cols = {
        padding: 10
    };


    const getSessionId = async () => {
        try{
            const response = await axios.get('http://54.232.52.181:3001/session')
            console.log('Session id response', response)
            return response.data.session_id;
        }catch(err){
            console.log('Error al obtener sesión', err)
        }
    }

    const statusMatch = ()=>{
        if (match === 2) {
            message.success("Resultado positivo con un 99.99% de confianza.")
            if (match === 1) {
                message.warning("[DEPRECADO] Resultado positivo con un 96.5% de confianza.")
            }if (match === 0) {
                message.error("Resultado negativo de la verificación.")
            }if (match === -1) {
                message.error("No se ha podido encontrar una cara en la imagen enviada.")
            }
        }
    }

    const apiKey = '433a8e1ed0dc4495974a9f95018eed8f' 
    const onFinish = async (values) => {
        try {
            let formData = new FormData();
            formData.append('id_front',tokenFront )
            formData.append('id_back',tokenBack )
            formData.append('selfie', tokenliveness)
            formData.append('apiKey', apiKey) 
            formData.append('documentType', dtype)
        //const response = await axios.post(`https://sandbox-api.7oc.cl/v2/face-and-document`, formData)
            const response = await axios.post(`https://sandbox-api.7oc.cl/v2/face-and-document`, formData)
            setInformation(response.data["information from document"].mrz.data)
            setMatch(response.data["biometric result"])
            message.success('Datos enviados correctamente', 3)
            statusMatch()
            setVisible(true)
        return response
        } catch (error) {
            message.error('Error al capturar la información');
        }
    }

    return (
        <Form
            layout={'horizontal'}
            form={form}
            onFinish={onFinish}
        >
            <Row>
                <Col lg={12} xs={24} style={{textAlign:"center", display:"inline-block"}} hidden={hidden} className="text-center">
                        <div className="text-center text-white border" style={{padding:10,  backgroundColor:'#03324B'}}>
                        <div className="card-body" style={{padding:10}}>
                        <p className="card-text text-white col d-flex">
                        Para verificar su identidad se necesitan fotos de su cédula de identidad y rostro, siguiendo los pasos que te mostraremos a continuación.
                        <br/>Evite usar accesorios como lentes o sombreros
                        <br/>Seleccione el tipo de documento para comenzar con la verificación.
                        </p>
                        </div>
                        </div>
                        <Select style={{paddingTop:10}} placeholder="Selecciona el tipo de documento" onChange={onChange}>
                            <Option value="MEX1">MEX1</Option>
                            <Option value="MEX2">MEX2</Option>
                            <Option value="MEX3">MEX3</Option>

                        </Select>
                </Col>
            </Row>
            <Row>
                <Col lg={12} xs={24} style={cols}  className="text-center text-white">
                <div>
                    <label className="text-center text-white font-weight-bold">Procedimiento</label>
                </div>
                <Button style={{backgroundColor:'#18938B', alignItems:"center"}} type="primary" onClick={divLiveness}>Realizar Onboarding
                </Button>
                </Col>
            </Row>
            {/* <Row>
                <Col lg={12} xs={24} style={cols}  className="text-center">
                    <div>
                    <label className="text-center text-white font-weight-bold">Captura</label>
                    </div>
                    <Button type="primary" onClick={divAutocaptureBack}>INE Posterior
                    </Button>
                </Col>
            </Row> 

            <Row>
                <Col lg={12} xs={24} style={cols} className="text-center" >
                    <div>
                    <label className="text-center text-white font-weight-bold">Captura</label>
                    </div>
                    <Button type="primary" onClick={divLiveness}>Liveness
                    </Button>
                </Col></Row>*/}
            <Row>
                <Col lg={24} xs={24} className="text-center" style={{ alignItems: "center" }}>
                    <Form.Item style={{ marginTop: 10}}>
                        <Button className="btn-sm"
                                htmlType="submit"
                                className="text-light text-center"
                                style={{backgroundColor:'#18938B'}}
                                >
                                Enviar informacion
                        </Button> 
                        <Modal
                            title="informacion escaneada "
                            visible={visible}
                            onOk={handleOk}
                            confirmLoading={confirmLoading}
                            onCancel={handleCancel}
                        >
                            <p>Apellidos Paternos: {information["family name"] ? information["family name"] : "Documento sin escanear"}</p>
                            <br/>
                            <p>Nombre Completo: {information.name ?  information.name : "Documento sin escanear"}</p>
                            <br/>
                            <p>Nacionalidad: {information.nationality ? information.nationality : "Documento sin escanear"}</p>
                            <br/>
                            <p>Genero: {information.gender ? information.gender : "Documento sin escanear"}</p>
                            <br/>
                            <p>Fecha Expiración: {information["expiration date"] ? information["expiration date"] : "Documento sin escanear"}</p>
                            <br/>
                            <p>Numero de documento: {information["document number"] ? information["document number"] : "Documento sin escanear"}</p>
                            <br/>
                            <p>Fecha Nacimiento: {information["date of birth"] ? information["date of birth"] : "Documento sin escanear"}</p>
                        </Modal>
                    </Form.Item>
                    <Col style={{paddingBottom:20, textAlign:"center"}} className="text-center">
                        <Button className="text-white" style={{backgroundColor:'#18938B'}}  onClick={showModal}>
                            informacion escaneada 
                        </Button>
                    </Col>
                </Col>                
            </Row>
            <div hidden={viewDiv} className="card">
                <div className="card-body">
                    <p className="card-text text-center">Capture su parte frontal
                        <div className="container-lg" style={{padding:20}} id="containerfront">
                        </div>
                    </p>
                </div>
            </div>
            <div hidden={viewDiv1} className="card">
                <div className="card-body">
                    <p className="card-text text-center">Capture su parte trasera
                        <div className="container-lg" style={{padding:20}} id="container">
                        </div>
                    </p>
                </div>
            </div>
            <div hidden={viewDiv2} className="card">
                <div className="card-body">
                    <p className="card-text text-center">Capture su rostro
                        <div className="container-lg" style={{padding:20}} id="liveness">
                        </div>
                    </p>
                </div>
            </div>
                               
        </Form>

        
    );
}



export default APIForm;
