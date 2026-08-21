import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';

const API=(import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/$/, '');

function api(path,opts={}){
  const token=localStorage.getItem('token');
  return fetch(API+path,{...opts,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...(opts.headers||{})}})
    .then(async r=>{const t=await r.text(); if(!r.ok) throw new Error(t||'Request failed'); try{return JSON.parse(t)}catch{return t}});
}

function App(){
 const [page,setPage]=useState('jobs'); const [jobs,setJobs]=useState([]); const [apps,setApps]=useState([]);
 const [search,setSearch]=useState(''); const [msg,setMsg]=useState(''); const [loading,setLoading]=useState(true);
 const role=localStorage.getItem('role');
 const name=localStorage.getItem('name');

 const load=()=>{setLoading(true);return api(search?'/jobs/search?q='+encodeURIComponent(search):'/jobs').then(setJobs).catch(e=>setMsg(e.message)).finally(()=>setLoading(false))};
 useEffect(()=>{load()},[]);

 function logout(){localStorage.clear();setPage('jobs');setMsg('You have been logged out.')}
 function login(e){e.preventDefault();const f=new FormData(e.target);
   api('/auth/login',{method:'POST',body:JSON.stringify(Object.fromEntries(f))}).then(x=>{localStorage.setItem('token',x.token);localStorage.setItem('role',x.role);localStorage.setItem('name',x.name);setPage('jobs');setMsg('Welcome back, '+x.name+'!')}).catch(e=>setMsg(e.message))}
 function register(e){e.preventDefault();const f=new FormData(e.target);api('/auth/register',{method:'POST',body:JSON.stringify(Object.fromEntries(f))}).then(()=>{e.target.reset();setPage('login');setMsg('Account created. Please sign in.')}).catch(e=>setMsg(e.message))}
 function createJob(e){e.preventDefault();const f=new FormData(e.target);api('/jobs',{method:'POST',body:JSON.stringify(Object.fromEntries(f))}).then(()=>{setMsg('Job created');e.target.reset();load()}).catch(e=>setMsg(e.message))}
 function apply(id){api('/applications/apply/'+id,{method:'POST'}).then(()=>setMsg('Applied successfully')).catch(e=>setMsg(e.message))}
 function myApps(){setLoading(true);api(role==='RECRUITER'?'/applications/recruiter':'/applications/my').then(setApps).then(()=>setPage('apps')).catch(e=>setMsg(e.message)).finally(()=>setLoading(false))}
 function status(id,status){api('/applications/'+id+'/status',{method:'PUT',body:JSON.stringify({status})}).then(myApps).catch(e=>setMsg(e.message))}

 return <div>
  <nav><button className="brand" onClick={()=>setPage('jobs')}>Hir<span>Job</span></button><div className="nav-links">
   <button onClick={()=>setPage('jobs')}>Jobs</button>
   {role==='RECRUITER'&&<button onClick={()=>setPage('create')}>Post Job</button>}
   {role&&<button onClick={myApps}>{role==='RECRUITER'?'Applicants':'My Applications'}</button>}
   {!role?<><button className="secondary" onClick={()=>setPage('login')}>Login</button><button onClick={()=>setPage('register')}>Create account</button></>:<><span className="welcome">Hi, {name}</span><button className="secondary" onClick={logout}>Logout</button></>}
  </div></nav>
  <main>
   {msg&&<div className="msg" role="status">{msg}<button className="close" onClick={()=>setMsg('')} aria-label="Dismiss message">×</button></div>}
   {page==='jobs'&&<><section className="hero"><p className="eyebrow">JOBS THAT FIT YOUR NEXT STEP</p><h1>Find work you’ll be proud to do.</h1><p>Search focused opportunities and apply in a few simple steps.</p></section><div className="search"><input aria-label="Search jobs" placeholder="Search by role or location" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&load()}/><button onClick={load}>Search jobs</button></div>
    {!loading&&<p className="result-count">{jobs.length} {jobs.length===1?'opportunity':'opportunities'} found</p>}{loading?<p className="empty">Loading jobs…</p>:jobs.length===0?<p className="empty">No jobs match your search. Try another keyword.</p>:jobs.map(j=><article className="card" key={j.id}><div className="job-heading"><div><h2>{j.title}</h2><p className="meta">{j.location || 'Location not specified'} {j.salary&&' · '+j.salary}</p></div>{role==='CANDIDATE'&&<button onClick={()=>apply(j.id)}>Apply now</button>}</div><p>{j.description}</p>{j.skills&&<p className="skills"><b>Skills:</b> {j.skills}</p>}</article>)}</>}
   {page==='login'&&<form className="form" onSubmit={login}><h2>Login</h2><input name="email" type="email" placeholder="Email" required/><input name="password" type="password" placeholder="Password" required/><button>Login</button></form>}
   {page==='register'&&<form className="form" onSubmit={register}><h2>Register</h2><input name="name" placeholder="Name" required/><input name="email" type="email" placeholder="Email" required/><input name="password" type="password" placeholder="Password" required/><select name="role"><option>CANDIDATE</option><option>RECRUITER</option></select><button>Register</button></form>}
   {page==='create'&&<form className="form" onSubmit={createJob}><h2>Post Job</h2><input name="title" placeholder="Job title" required/><input name="location" placeholder="Location" required/><input name="salary" placeholder="Salary"/><input name="skills" placeholder="Skills e.g. Java, Spring Boot"/><textarea name="description" placeholder="Job description" required/><button>Post Job</button></form>}
   {page==='apps'&&<><h2>{role==='RECRUITER'?'Applicants':'My Applications'}</h2>{apps.map(a=><div className="card" key={a.id}><h3>{a.job.title}</h3><p>{role==='RECRUITER'?'Candidate: '+a.candidate.name+' ('+a.candidate.email+')':'Status: '+a.status}</p><p>Applied: {a.appliedAt?.replace('T',' ')}</p>{role==='RECRUITER'&&<><button onClick={()=>status(a.id,'SHORTLISTED')}>Shortlist</button> <button onClick={()=>status(a.id,'REJECTED')}>Reject</button></>}</div>)}</>}
  </main>
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);
