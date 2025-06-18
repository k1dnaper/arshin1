import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

export const FormGroups = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
`;

export const FormGroup = styled.div`
  flex: 1 1 calc(33.333% - 20px);
  min-width: 250px;
  box-sizing: border-box;
  margin-bottom: 0;
  label {
    display: block;
    margin-bottom: 5px;
    color: #333;
    font-weight: 500;
  }
  @media (max-width: 900px) {
    flex: 1 1 calc(50% - 20px);
  }
  @media (max-width: 600px) {
    flex: 1 1 100%;
  }
`;

export const StyledSelect = styled.select`
  width: auto;
  min-width: 100px;
  max-width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1rem;
`;

export const StyledButton = styled.button`
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 5px;
  margin-bottom: 5px;
  &:hover {
    background-color: #218838;
  }
`;

export const StyledPre = styled.pre`
  background-color: #f8f9fa;
  padding: 10px;
  border: 1px solid #ccc;
  white-space: pre-wrap;
  border-radius: 4px;
`; 