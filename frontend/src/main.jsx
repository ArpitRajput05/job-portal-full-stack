import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';

const API='http://localhost:8080/api';

function api(path,opts={}){
  const token=localStorage.getItem('token');
  return fetch(API+path,{...opts,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...(opts.headers||{})}})
    .then(async r=>{const t=await r.text(); if(!r.ok) throw new Error(t||'Request failed'); try{return JSON.parse(t)}catch{return t}});
}

function App(){
 const [page,setPage]=useState('jobs'); const [jobs,setJobs]=useState([]); const [apps,setApps]=useState([]);
 const [search,setSearch]=useState(''); const [msg,setMsg]=useState('');
 const role=localStorage.getItem('role');

 const load=()=>api(search?'/jobs/search?q='+encodeURIComponent(search):'/jobs').then(setJobs).catch(e=>setMsg(e.message));
 useEffect(()=>{load()},[]);

 function logout(){localStorage.clear();setPage('jobs');setMsg('Logged out')}
 function login(e){e.preventDefault();const f=new FormData(e.target);
   api('/auth/login',{method:'POST',body:JSON.stringify(Object.fromEntries(f))}).then(x=>{localStorage.setItem('token',x.token);localStorage.setItem('role',x.role);setPage('jobs');setMsg('Login successful')}).catch(e=>setMsg(e.message))}
 function register(e){e.preventDefault();const f=new FormData(e.target);api('/auth/register',{method:'POST',body:JSON.stringify(Object.fromEntries(f))}).then(()=>setMsg('Registered. Now login.')).catch(e=>setMsg(e.message))}
 function createJob(e){e.preventDefault();const f=new FormData(e.target);api('/jobs',{method:'POST',body:JSON.stringify(Object.fromEntries(f))}).then(()=>{setMsg('Job created');e.target.reset();load()}).catch(e=>setMsg(e.message))}
 function apply(id){api('/applications/apply/'+id,{method:'POST'}).then(()=>setMsg('Applied successfully')).catch(e=>setMsg(e.message))}
 function myApps(){api(role==='RECRUITER'?'/applications/recruiter':'/applications/my').then(setApps).then(()=>setPage('apps')).catch(e=>setMsg(e.message))}
 function status(id,status){api('/applications/'+id+'/status',{method:'PUT',body:JSON.stringify({status})}).then(myApps).catch(e=>setMsg(e.message))}

 return <div>
  <nav><b>JobPortal</b><div>
   <button onClick={()=>setPage('jobs')}>Jobs</button>
   {role==='RECRUITER'&&<button onClick={()=>setPage('create')}>Post Job</button>}
   {role&&<button onClick={myApps}>{role==='RECRUITER'?'Applicants':'My Applications'}</button>}
   {!role?<><button onClick={()=>setPage('login')}>Login</button><button onClick={()=>setPage('register')}>Register</button></>:<button onClick={logout}>Logout</button>}
  </div></nav>
  <main>
   {msg&&<div className="msg">{msg}</div>}
   {page==='jobs'&&<><h1>Find Your Next Job</h1><div className="search"><input placeholder="Search title or location" value={search} onChange={e=>setSearch(e.target.value)}/><button onClick={load}>Search</button></div>
    {jobs.map(j=><div className="card" key={j.id}><h2>{j.title}</h2><p>{j.description}</p><p><b>Location:</b> {j.location} &nbsp; <b>Salary:</b> {j.salary}</p><p><b>Skills:</b> {j.skills}</p>{role==='CANDIDATE'&&<button onClick={()=>apply(j.id)}>Apply</button>}</div>)}</>}
   {page==='login'&&<form className="form" onSubmit={login}><h2>Login</h2><input name="email" type="email" placeholder="Email" required/><input name="password" type="password" placeholder="Password" required/><button>Login</button></form>}
   {page==='register'&&<form className="form" onSubmit={register}><h2>Register</h2><input name="name" placeholder="Name" required/><input name="email" type="email" placeholder="Email" required/><input name="password" type="password" placeholder="Password" required/><select name="role"><option>CANDIDATE</option><option>RECRUITER</option></select><button>Register</button></form>}
   {page==='create'&&<form className="form" onSubmit={createJob}><h2>Post Job</h2><input name="title" placeholder="Job title" required/><input name="location" placeholder="Location" required/><input name="salary" placeholder="Salary"/><input name="skills" placeholder="Skills e.g. Java, Spring Boot"/><textarea name="description" placeholder="Job description" required/><button>Post Job</button></form>}
   {page==='apps'&&<><h2>{role==='RECRUITER'?'Applicants':'My Applications'}</h2>{apps.map(a=><div className="card" key={a.id}><h3>{a.job.title}</h3><p>{role==='RECRUITER'?'Candidate: '+a.candidate.name+' ('+a.candidate.email+')':'Status: '+a.status}</p><p>Applied: {a.appliedAt?.replace('T',' ')}</p>{role==='RECRUITER'&&<><button onClick={()=>status(a.id,'SHORTLISTED')}>Shortlist</button> <button onClick={()=>status(a.id,'REJECTED')}>Reject</button></>}</div>)}</>}
  </main>
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);
