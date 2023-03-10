/* eslint-disable no-console */
import Avatar from '@material-ui/core/Avatar';
import blue from '@material-ui/core/colors/blue';
import { connect } from 'react-redux';
import './File.css';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteOutlineRounded from '@material-ui/icons/DeleteOutlineRounded';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { fetchFileList, fileIdUpdate, updateBreadCrum, currentFolderId, deleteFile } from '../../actions/files';

const useStyles = makeStyles({
  root: {
    maxWidth: 345
  }
});

function File ({ files, singleFile, handleClick, handleDoubleClick, isSelected, deleteFileId }) {
  const classes = useStyles();
  let fileName = 'No Name';
  if (singleFile.type === 'file') {
    fileName = singleFile.info && singleFile.info.name ? singleFile.info.name : fileName;
  } else if (singleFile.type === 'folder') {
    fileName = singleFile.name || fileName;
  }
  const avatarStyle = {
    backgroundColor: isSelected ? blue['A200'] : null
  };
  return (
    <div className="File" onClick={handleClick} onDoubleClick={handleDoubleClick} data-selected={isSelected} >
      <ListItem>
        {<DeleteOutlineRounded style={{ margin: 15, color: 'red' }} onClick={() => {
          let parentId = files.parentId || '';
          deleteFileId({ fileId: singleFile._id, parentId });
        }}/>}
        <ListItemAvatar>
          <Avatar style={avatarStyle}>
            { singleFile.type === 'folder' ? <FolderIcon /> : <FileIcon />}
          </Avatar>
        </ListItemAvatar>
        <ListItemText className="filename" primary={fileName} secondary={20} />
      </ListItem>
    </div>
  );
}
const mapStateToProps = (state, ownProps) => {
  return {
    files: state.files
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  let clickRestict = '';
  return {
    deleteFileId: (data) => {
      dispatch(deleteFile(data));
    },
    handleDoubleClick: (event) => {
      let singleFile = ownProps.singleFile;
      if (singleFile.type === 'file') {
        // dispatch(getFileContent(ownProps.name));
        return;
      }
      clearTimeout(clickRestict);
      let breadcrum = ownProps.files && ownProps.files.breadcrum ? ownProps.files.breadcrum : [];
      breadcrum.push({ _id: singleFile._id, name: singleFile.name });
      dispatch(updateBreadCrum({ list: breadcrum }));
      dispatch(currentFolderId({ fileId: singleFile._id }));
      dispatch(fetchFileList({
        parentId: singleFile._id
      }));
    },
    
    handleClick: (event) => {
      event.stopPropagation();
      if (ownProps.singleFile && ownProps.singleFile._id) {
        clickRestict = setTimeout(() => {
          dispatch(fileIdUpdate({ fileId: ownProps.singleFile._id }));
        }, 250);
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(File);
