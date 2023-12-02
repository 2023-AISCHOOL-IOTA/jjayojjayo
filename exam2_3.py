#!/usr/bin/env python
# coding: utf-8

# In[1]:


import torch

from transformers import BartForConditionalGeneration, BartTokenizer
from transformers import PreTrainedTokenizerFast, BartForConditionalGeneration, Seq2SeqTrainingArguments, Seq2SeqTrainer


# In[2]:


model = BartForConditionalGeneration.from_pretrained("komodel2_3.pt/")


# In[3]:


tokenizer = PreTrainedTokenizerFast.from_pretrained('hyunwoongko/kobart')


# In[4]:


def sentence_predict(sent):

    # 입력 문장을 모델이 처리할 수 있는 형태로 토큰화합니다.
    inputs = tokenizer(sent, return_tensors="pt", max_length=512, truncation=True, padding="max_length")

    # 토큰화된 데이터를 GPU로 옮깁니다(사용 가능한 경우).
    if torch.cuda.is_available():
        inputs = {key: val.to('cuda') for key, val in inputs.items()}

    # 생성(generation)을 수행하여 스타일이 변환된 결과를 얻습니다.
    outputs = model.generate(
        inputs["input_ids"],
        max_length=len(sent)*2,
        num_beams=5,
        no_repeat_ngram_size=2,
        early_stopping=True
    )

    # 생성된 토큰들을 문장으로 디코딩합니다.
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # 결과를 출력합니다.
    return generated_text

