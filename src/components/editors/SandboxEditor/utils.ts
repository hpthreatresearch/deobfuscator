// © Copyright 2023 HP Development Company, L.P.
/**
 * An escaped quine. The source is in test/samples/quine.js
 */
export const defaultCode = `/* ______           _      __                     _             
   |  _  \\         | |    / _|                   | |            
   | | | |___  ___ | |__ | |_ _   _ ___  ___ __ _| |_ ___  _ __ 
   | | | / _ \\/ _ \\| '_ \\|  _| | | / __|/ __/ _\` | __/ _ \\| '__|
   | |/ /  __/ (_) | |_) | | | |_| \\__ \\ (_| (_| | || (_) | |   
   |___/ \\___|\\___/|_.__/|_|  \\__,_|___/\\___\\__,_|\\__\\___/|_| */
!function f(){r="\\\\U/ATMMS ARUBQEEPDPO\\nDENDDDMU_L_/K|_J_|I/ H"+
" UG| F |E  D_ C__B _A/*ABBCMDRDDRCSMRS NRDUMODDT|SMPSNPEBCABP"+
"BP_ADAABRBA_A|E_ABRACNP TGTGF'CUFA|P TITKA\`EAKAGF'B|NEHHA_H(_"+
")P_)PP_FQG (_F(IPF(_)PD NBKGBIQKJ.B/|IDQ,IBKQ_Q,IQQKJF*/";for(k
=85;k>64;k--)a=String.fromCharCode(k),i=r.indexOf(a),r=r.slice(i
+1).replaceAll(a,r.slice(0,i));console.log(\`\${r}\\n!\${f}()\\n\`)}()
`;
