import { useState } from 'react'
import { colors, radius, typography, shadows } from '../../theme'

// Datos inventados basados en tu imagen de referencia
const historialMock = [
  { id: 1, fechaSol: '20/12/2025', fechaRev: '10/01/2025', contratista: 'Juan', tipo: 'Pago', estado: 'Aprobada' },
  { id: 1, fechaSol: '20/12/2025', fechaRev: '10/01/2025', contratista: 'Juan', tipo: 'Pago', estado: 'Devuelta' },
  { id: 1, fechaSol: '20/12/2025', fechaRev: '10/01/2025', contratista: 'Juan', tipo: 'Pago', estado: 'Aprobada' },
  { id: 1, fechaSol: '20/12/2025', fechaRev: '10/01/2025', contratista: 'Juan', tipo: 'Pago', estado: 'Devuelta' },
]

export default function HistorialSupervisor() {
  const [busqueda, setBusqueda] = useState('')

  return (
    <>
      <style>{`
        .hs-shell {
          width: 100%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        /* --- Barra Superior (Buscador e Íconos) --- */
        .hs-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 10px 0;
        }

        .hs-search-container {
          position: relative;
          width: 50%;
          max-width: 600px;
          margin: 0 auto;
        }

        .hs-search-input {
          width: 100%;
          padding: 14px 20px 14px 40px;
          border-radius: 30px;
          border: none;
          background: white;
          font-family: inherit;
          font-size: ${typography?.md || '14px'};
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          outline: none;
          box-sizing: border-box;
        }

        .hs-search-icon {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #A0AABF;
        }

        .hs-top-actions {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .hs-icon-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .hs-icon-btn:hover {
          transform: scale(1.05);
        }

        .hs-btn-settings { background-color: #FFC107; } /* Amarillo */
        .hs-btn-mail { background-color: #589A42; }     /* Verde */

        .hs-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background-color: #D32F2F;
          color: white;
          font-size: 10px;
          font-weight: bold;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #F0F4F8; /* Color fondo general para simular recorte */
        }

        /* --- Tarjeta Principal y Tabla --- */
        .hs-card {
          background: ${colors?.bgCard || 'white'};
          border-radius: ${radius?.xl || '24px'};
          box-shadow: ${shadows?.card || '0 8px 30px rgba(0,0,0,0.04)'};
          padding: 32px;
          width: 100%;
          box-sizing: border-box;
        }

        .hs-title {
          margin: 0 0 24px 0;
          font-size: 24px;
          font-weight: 800;
          color: ${colors?.textPrimary || '#1A2C6B'};
        }

        .hs-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .hs-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 8px; /* Espacio entre filas para simular el diseño */
          text-align: center;
          min-width: 800px;
        }

        .hs-table th {
          background-color: #EBF2F9; /* Azul muy claro */
          color: #111827;
          padding: 16px;
          font-weight: 700;
          font-size: 14px;
          border: none;
        }

        .hs-table th:first-child { border-top-left-radius: 8px; border-bottom-left-radius: 8px; }
        .hs-table th:last-child { border-top-right-radius: 8px; border-bottom-right-radius: 8px; }

        .hs-table td {
          padding: 14px 16px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          background-color: white;
        }

        /* Alternancia de color en filas (Fila par es azul claro) */
        .hs-table tr:nth-child(even) td {
          background-color: #EBF2F9; 
        }

        .hs-table td:first-child { border-top-left-radius: 8px; border-bottom-left-radius: 8px; }
        .hs-table td:last-child { border-top-right-radius: 8px; border-bottom-right-radius: 8px; }

        /* Botón de Ver (Ojo verde) */
        .hs-btn-ver {
          background-color: #549E39;
          border: none;
          border-radius: 6px;
          width: 36px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
        }

        .hs-btn-ver:hover {
          opacity: 0.85;
          transform: translateY(-1px);
        }

      `}</style>

      <div className="hs-shell">
        
        {/* Barra Superior */}
        <div className="hs-topbar">
          <div style={{ width: '100px' }}></div> {/* Espaciador invisible para centrar buscador */}
          
          <div className="hs-search-container">
            <input 
              type="text" 
              className="hs-search-input" 
              placeholder="Buscar..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <div className="hs-search-icon">
              <SearchIcon />
            </div>
          </div>

          <div className="hs-top-actions">
            <button className="hs-icon-btn hs-btn-settings">
              <WrenchIcon />
            </button>
            <button className="hs-icon-btn hs-btn-mail">
              <MailIcon />
              <div className="hs-badge">13</div>
            </button>
          </div>
        </div>

        {/* Tarjeta de Historial */}
        <div className="hs-card">
          <h2 className="hs-title">Historial de solicitudes</h2>

          <div className="hs-table-wrapper">
            <table className="hs-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha Solicitud</th>
                  <th>Fecha revision</th>
                  <th>Contratista</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Ver Solicitud</th>
                </tr>
              </thead>
              <tbody>
                {historialMock.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.fechaSol}</td>
                    <td>{item.fechaRev}</td>
                    <td>{item.contratista}</td>
                    <td>{item.tipo}</td>
                    <td>{item.estado}</td>
                    <td>
                      <button className="hs-btn-ver" title="Ver Solicitud">
                        <EyeIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  )
}

/* --- Íconos en SVG (Limpios y ligeros) --- */

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  )
}

function WrenchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  )
}