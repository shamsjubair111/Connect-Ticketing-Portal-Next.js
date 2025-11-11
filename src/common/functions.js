import { postAttachmentToS3, getPresignedPost } from "../api/ticketingApis";
export function checkPhoneFormat(num) {
  const regex = /^8809638.{6}$/;
  if (regex.test(num)) {
    return true;
  } else return false;
}

export function checkPhoneFormatEleven(num) {
  const regex = /^880.{10}$/;
  if (regex.test(num)) {
    return true;
  } else return false;
}

export async function handleFileUpload(selectedFiles) {
  let _attachments = [];
  for (let i = 0; i < selectedFiles.length; i++) {
    let gpp = await getPresignedPost({ object_name: selectedFiles[i].name });
    _attachments.push(gpp.data.public_url);
    let url = gpp.data.data.url;
    let formData = new FormData();
    let file = selectedFiles[i];
    const { AWSAccessKeyId, key, policy, signature } = gpp.data.data.fields;
    formData.append("Content-Type", gpp.data.data.fields["Content-Type"]);
    formData.append("key", key);
    formData.append("AWSAccessKeyId", AWSAccessKeyId);
    formData.append("policy", policy);
    formData.append("signature", signature);
    formData.append("file", file);
    postAttachmentToS3(url, formData);
  }
  return _attachments;
}
