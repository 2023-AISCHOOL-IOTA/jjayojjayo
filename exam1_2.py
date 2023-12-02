#!/usr/bin/env python
# coding: utf-8

# In[6]:


import torch

from transformers import AutoModelForSequenceClassification,AutoTokenizer


# In[7]:


# MODEL_NAME = 'beomi/KcELECTRA-base'
MODEL_NAME = 'beomi/KcELECTRA-base-v2022'

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)


# In[10]:


#model = AutoModelForSequenceClassification.from_pretrained("kcmodel.pt/")
model = AutoModelForSequenceClassification.from_pretrained("kcelectra1_5.pt/")


# In[11]:


def sentence_predict(sent):
  # 평가모드로 변경
  model.eval()

  # 입력된 문장 토크나이징
  tokenized_sent = tokenizer(
      sent,
      return_tensors = 'pt',
      truncation = True,
      add_special_tokens = True,
      max_length = 128
  )

  # 예측
  with torch.no_grad():
    outputs = model(
        input_ids = tokenized_sent['input_ids'],
        attention_mask = tokenized_sent['attention_mask'],
        token_type_ids = tokenized_sent['token_type_ids']
        )

  # 결과 return
  logits = outputs[0]
  logits = logits.detach().cpu()
  result = logits.argmax(-1).item()
  result_text = sent

#    if result == 0:
#      result = f'{result_text} >> 악성댓글 😈'
#    elif result == 1:
#      result = f'{result_text} >> 정상댓글 😊'

  return result

