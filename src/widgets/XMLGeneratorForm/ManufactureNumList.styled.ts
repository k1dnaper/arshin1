import styled from 'styled-components';

export const DynamicList = styled.div`
  margin-top: 10px;
`;

export const MiBlock = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
`;

export const MiHeader = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
`;

export const RemoveBtn = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  height: fit-content;
  align-self: center;
  &:hover {
    background-color: #c82333;
  }
`; 