import React, { useState } from 'react';
import { Settings, RotateCcw } from 'lucide-react';

const CheckersGame = () => {
  const [board, setBoard] = useState(initializeBoard());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('red');
  const [showSettings, setShowSettings] = useState(false);
  const [boardColor1, setBoardColor1] = useState('#f0d9b5');
  const [boardColor2, setBoardColor2] = useState('#b58863');
  const [redPieceColor, setRedPieceColor] = useState('#dc2626');
  const [blackPieceColor, setBlackPieceColor] = useState('#1f2937');
  const [mustCapture, setMustCapture] = useState(null);

  function initializeBoard() {
    const b = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Peças pretas (topo)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          b[row][col] = { color: 'black', isKing: false };
        }
      }
    }
    
    // Peças vermelhas (Baixo)
    for (let row = 5; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          b[row][col] = { color: 'red', isKing: false };
        }
      }
    }
    
    return b;
  }

  function getValidMoves(row, col, boardState = board, captureOnly = false) {
    const piece = boardState[row][col];
    if (!piece) return [];
    
    const moves = [];

    // Direções baseadas no tipo de peça
    const directions = piece.isKing 
      ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
      : piece.color === 'red' 
        ? [[-1, -1], [-1, 1]]
        : [[1, -1], [1, 1]];
    
    // Verifica capturas
    for (const [dr, dc] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
      if (piece.isKing) {
        // Dama pode capturar um qualquer distância na diagonal
        for (let dist = 1; dist < 8; dist++) {
          const midRow = row + dr * dist;
          const midCol = col + dc * dist;
          
          if (midRow < 0 || midRow >= 8 || midCol < 0 || midCol >= 8) break;
          
          const midPiece = boardState[midRow][midCol];
          
          if (midPiece) {
            if (midPiece.color !== piece.color) {
              // Encontrou peça inimiga, verifica casas vazias depois dela
              for (let landDist = 1; landDist < 8; landDist++) {
                const jumpRow = midRow + dr * landDist;
                const jumpCol = midCol + dc * landDist;
                
                if (jumpRow < 0 || jumpRow >= 8 || jumpCol < 0 || jumpCol >= 8) break;
                
                if (!boardState[jumpRow][jumpCol]) {
                  moves.push({ 
                    row: jumpRow, 
                    col: jumpCol, 
                    capture: { row: midRow, col: midCol } 
                  });
                } else {
                  break;
                }
              }
            }
            break;
          }
        }
      } else {
        // Peça normal captura apenas uma casa de distância
        const jumpRow = row + dr * 2;
        const jumpCol = col + dc * 2;
        const midRow = row + dr;
        const midCol = col + dc;
        
        if (jumpRow >= 0 && jumpRow < 8 && jumpCol >= 0 && jumpCol < 8) {
          const midPiece = boardState[midRow][midCol];
          if (midPiece && midPiece.color !== piece.color && !boardState[jumpRow][jumpCol]) {
            moves.push({ 
              row: jumpRow, 
              col: jumpCol, 
              capture: { row: midRow, col: midCol } 
            });
          }
        }
      }
    }
    
    // Se não for captura obrigatória, adiciona movimentos simples
    if (!captureOnly && moves.length === 0) {
      for (const [dr, dc] of directions) {
        if (piece.isKing) {
          // Dama pode se mover qualquer distância na diagonal
          for (let dist = 1; dist < 8; dist++) {
            const newRow = row + dr * dist;
            const newCol = col + dc * dist;
            
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
            
            if (!boardState[newRow][newCol]) {
              moves.push({ row: newRow, col: newCol, capture: null });
            } else {
              break;
            }
          }
        } else {
          // Peça normal move apenas uma casa
          const newRow = row + dr;
          const newCol = col + dc;
          
          if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            if (!boardState[newRow][newCol]) {
              moves.push({ row: newRow, col: newCol, capture: null });
            }
          }
        }
      }
    }
    
    return moves;
  }

  function hasCaptures(color, boardState = board){
    for(let row = 0; row < 8; row++){
      for(let col = 0; col < 8; col++){
        const piece = boardState[row][col];
        if(piece && piece.color === color){
          const moves = getValidMoves(row, col, boardState, false);
          if(moves.some(m => m.capture)){
            return true
          }
        }
      }
    }
    return false;
  }

  function handleSquareClick(row, col) {
    if (mustCapture) {
      // Deve continuar capturando com a mesma peça
      const validMoves = getValidMoves(mustCapture.row, mustCapture.col);
      const captureMove = validMoves.find(m => m.row === row && m.col === col && m.capture);
      
      if (captureMove) {
        const newBoard = board.map(r => [...r]);
        const piece = newBoard[mustCapture.row][mustCapture.col];
        
        newBoard[row][col] = piece;
        newBoard[mustCapture.row][mustCapture.col] = null;
        newBoard[captureMove.capture.row][captureMove.capture.col] = null;
        
        // Promove a dama
        if ((piece.color === 'red' && row === 0) || 
            (piece.color === 'black' && row === 7)) {
          newBoard[row][col].isKing = true;
        }
        
        setBoard(newBoard);
        
        // Verifica se pode continuar capturando
        const furtherCaptures = getValidMoves(row, col, newBoard, false).filter(m => m.capture);
        
        if (furtherCaptures.length > 0) {
          setMustCapture({ row, col });
          setSelectedPiece({ row, col });
        } else {
          setMustCapture(null);
          setSelectedPiece(null);
          setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red');
        }
      }
      return;
    }
    
    if (selectedPiece) {
      const validMoves = getValidMoves(selectedPiece.row, selectedPiece.col);
      const move = validMoves.find(m => m.row === row && m.col === col);
      
      if (move) {
        const newBoard = board.map(r => [...r]);
        const piece = newBoard[selectedPiece.row][selectedPiece.col];
        
        newBoard[row][col] = piece;
        newBoard[selectedPiece.row][selectedPiece.col] = null;
        
        if (move.capture) {
          newBoard[move.capture.row][move.capture.col] = null;
        }
        
        // Promove a dama
        if ((piece.color === 'red' && row === 0) || 
            (piece.color === 'black' && row === 7)) {
          newBoard[row][col].isKing = true;
        }
        
        setBoard(newBoard);
        
        // Verifica se pode continuar capturando
        if (move.capture) {
          const furtherCaptures = getValidMoves(row, col, newBoard, false).filter(m => m.capture);
          
          if (furtherCaptures.length > 0) {
            setMustCapture({ row, col });
            setSelectedPiece({ row, col });
            return;
          }
        }
        
        setSelectedPiece(null);
        setMustCapture(null);
        setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red');
      } else {
        setSelectedPiece(null);
      }
    } else {
      const piece = board[row][col];
      if (piece && piece.color === currentPlayer) {
        const playerHasCaptures = hasCaptures(currentPlayer);
        const pieceHasCaptures = getValidMoves(row, col).some(m => m.capture);
        
        // Se há capturas disponíveis, só permite selecionar peças que podem capturar
        if (playerHasCaptures && !pieceHasCaptures) {
          return;
        }
        
        setSelectedPiece({ row, col });
      }
    }
  }

  function resetGame() {
    setBoard(initializeBoard());
    setSelectedPiece(null);
    setCurrentPlayer('red');
    setMustCapture(null);
  }

  const validMoves = selectedPiece ? getValidMoves(selectedPiece.row, selectedPiece.col) : [];
  //const playerHasCaptures = hasCaptures(currentPlayer);


  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    wrapper: {
      maxWidth: '600px',
      width: '100%'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    title: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: 'white',
      margin: 0
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px'
    },
    iconButton: {
      padding: '12px',
      background: '#374151',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    turnBox: {
      background: 'rgba(55, 65, 81, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '20px',
      textAlign: 'center'
    },
    turnText: {
      color: 'white',
      fontSize: '20px',
      margin: 0,
      fontWeight: '500'
    },
    settingsPanel: {
      background: 'rgba(55, 65, 81, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px'
    },
    boardContainer: {
      background: 'rgba(31, 41, 55, 0.8)',
      backdropFilter: 'blur(10px)',
      padding: '12px',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
    },
    board: {
      display: 'grid',
      gridTemplateColumns: 'repeat(8, 1fr)',
      gap: '2px',
      aspectRatio: '1',
      background: '#000',
      borderRadius: '8px',
      overflow: 'hidden'
    },
    legend: {
      marginTop: '20px',
      background: 'rgba(55, 65, 81, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '16px',
      textAlign: 'center',
      color: 'white',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>🎮 Damas</h1>
          <div style={styles.buttonGroup}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              style={styles.iconButton}
              onMouseEnter={(e) => e.target.style.background = '#4b5563'}
              onMouseLeave={(e) => e.target.style.background = '#374151'}
            >
              <Settings size={24} color="white" />
            </button>
            <button
              onClick={resetGame}
              style={styles.iconButton}
              onMouseEnter={(e) => e.target.style.background = '#4b5563'}
              onMouseLeave={(e) => e.target.style.background = '#374151'}
            >
              <RotateCcw size={24} color="white" />
            </button>
          </div>
        </div>

        {/* Turno */}
        <div style={styles.turnBox}>
          <p style={styles.turnText}>
            Turno: <span style={{ color: currentPlayer === 'red' ? redPieceColor : blackPieceColor, fontWeight: 'bold' }}>
              {currentPlayer === 'red' ? '🔴 Vermelho' : '⚫ Preto'}
            </span>
          </p>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div style={styles.settingsPanel}>
            <h3 style={{ color: 'white', marginTop: 0 }}>🎨 Personalizar Cores</h3>
            {[
              { label: 'Casa Clara', value: boardColor1, setter: setBoardColor1 },
              { label: 'Casa Escura', value: boardColor2, setter: setBoardColor2 },
              { label: 'Peças Vermelhas', value: redPieceColor, setter: setRedPieceColor },
              { label: 'Peças Pretas', value: blackPieceColor, setter: setBlackPieceColor }
            ].map(({ label, value, setter }) => (
              <div key={label} style={{ marginBottom: '15px' }}>
                <label style={{ color: 'white', display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                  {label}:
                </label>
                <input
                  type="color"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  style={{
                    width: '100%',
                    height: '45px',
                    borderRadius: '8px',
                    border: '2px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer'
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Tabuleiro */}
        <div style={styles.boardContainer}>
          <div style={styles.board}>
            {board.map((row, rowIndex) =>
              row.map((piece, colIndex) => {
                const isLight = (rowIndex + colIndex) % 2 === 0;
                const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
                const isValidMove = validMoves.some(m => m.row === rowIndex && m.col === colIndex);

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      backgroundColor: isLight ? boardColor1 : boardColor2,
                      boxShadow: isSelected ? 'inset 0 0 0 4px #fbbf24' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    {piece && (
                      <div
                        style={{
                          position: 'absolute',
                          width: '70%',
                          height: '70%',
                          borderRadius: '50%',
                          backgroundColor: piece.color === 'red' ? redPieceColor : blackPieceColor,
                          border: '3px solid rgba(255,255,255,0.3)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {piece.isKing && (
                          <span style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>♔</span>
                        )}
                      </div>
                    )}
                    {isValidMove && (
                      <div
                        style={{
                          position: 'absolute',
                          width: '30%',
                          height: '30%',
                          background: '#4ade80',
                          borderRadius: '50%',
                          opacity: 0.7,
                          boxShadow: '0 0 10px #4ade80'
                        }}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Legenda */}
        <div style={styles.legend}>
          ♔ Dama move-se em qualquer distância • Capture todas as peças adversárias para vencer!
        </div>
      </div>
    </div>
  );
};

export default CheckersGame;