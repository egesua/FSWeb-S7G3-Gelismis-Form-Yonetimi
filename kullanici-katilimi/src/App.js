import Form from "./components/Form";
import "./App.css";
import { Switch, Route, NavLink, useHistory } from "react-router-dom"
import { useState } from "react";
import * as Yup from "yup";

function App() {
  const membersInfo = [{
    id: 0,
    img: "https://picsum.photos/300/301",
    name: "Ege Su Açıkgöz",
    email: "egesu06@gmail.com",
    rol: "Developer",
    terms: true
  },
  {
    id: 1,
    img: "https://picsum.photos/300/302",
    name: "Sevgi Kirak",
    email: "kiraksevgi@gmail.com",
    rol: "Athlete",
    terms: true
  },
  {
    id: 2,
    img: "https://picsum.photos/300/303",
    name: "Ufuk Açıkgöz",
    email: "ufukacikgoz@gmail.com",
    rol: "Engineer",
    terms: true
  },
];

  const formDataInitial =
  {
    name: "",
    email: "",
    password: "",
    terms : false
  }

  const [formData, setFormData] = useState(formDataInitial);
  const [members, setMembers] = useState(membersInfo);
  const [isValid, SetValid] = useState(false);
  const [errors, setErrors] = useState({
    name:"",
    email:"",
    rol:"",
    terms:""
});
  

const membersFromSchema = Yup.object().shape({
  name: Yup.string()
  .required("Isim giriniz..")
  .min(3, "Minimum 3 karakter zorunlu!"),
  email: Yup.string()
  .required("Mailinizi giriniz..")
  .email("Email geçerli olmalı."),
  rol: Yup.string()
  .required("Rol giriniz.."),
  terms: Yup.boolean().oneOf([true], "Şartları kabul et!")
})

  const history = useHistory();

  const submitHandler = (e) => {
    e.preventDefault();
    if (formData.id) {
      let updateMember = members.map((member) => {
        if(member.id === formData.id) {
          return formData;
        } else {
          return member;
        }
      });
      setMembers(updateMember);
    } else {
      const newMember = {
        ...formData,
        ["img"]: "https://picsum.photos/300/304",
        ["id"]: members[members.length - 1].id + 1
      };
      setMembers([...members, newMember]);
    }
    setFormData(formDataInitial);
    history.push("/");
  };

  const changeHandler = (e) => {
    let { value, type, name, checked } = e.target;
    value = type == "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: value });

    Yup.reach(membersFromSchema, name)
      .validate(value)
      .then(res => setErrors({ ...errors, [name]: "" })
        .catch(err => setErrors({ ...errors, [name]: err.errors[0] })
        )
      );
  };

  const editMember = (member) => {
    setFormData(member);
    history.push("/signup");
  };


  useEffect(() => {
    membersFromSchema.isValid(formData).then((valid) => SetValid(!valid));
}, [formData]);


  return (
    <div>
      <header>
        <nav className='d-flex gap-5 p-3'>
          <NavLink to="/" exact>
            Home
          </NavLink>
          <NavLink to="/signup" exact>
            New Member
          </NavLink>
        </nav>
      </header>
      <Switch>
        <Route path="/" exact>
          <Members members={members} editMember={editMember} />
        </Route>
        <Route path="/signup" exact>
          <Form submitHandler={submitHandler} changeHandler={changeHandler} formData={formData} isValid={isValid} errors={errors} />
        </Route>
      </Switch>
    </div>
  );
} 

export default App;
