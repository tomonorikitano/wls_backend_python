from __future__ import print_function

import json
import csv
#import urllib
import boto3

print('*Loading lambda: s3FileListRead')

s3 = boto3.client('s3')

def lambda_handler(event, context):

    print('==== file list in bucket ====')
    AWS_S3_BUCKET_NAME = 'kitano-5a-stu-hosei-ac-jp'
    s3_resource = boto3.resource('s3')
    bucket = s3_resource.Bucket(AWS_S3_BUCKET_NAME)
    result = bucket.meta.client.list_objects(Bucket=bucket.name, Delimiter='/')
    
    def csv_to_json(csv_data):
        # CSVデータをパースしてJSONデータに変換
        lines = csv_data.decode('utf-8').splitlines()
        #print(lines)
        reader = csv.DictReader(lines)
        #print(reader)
        json_data = [row for row in reader]
        #print(json_data)
        return json_data
    
    json_wordsID_word_mean = {}
    json_wordsID_list = []
    
    contents = result.get('Contents')
    
    if contents is not None:
        for o in result.get('Contents'):
            wordsID = o.get('Key')  # flie name will be printed
            #print(wordsID)
            response = s3.get_object(Bucket=bucket.name, Key=o.get('Key'))
            data = response['Body'].read()
            #print(data.decode('utf-8'))  # file contents will be printed
            
            json_data = csv_to_json(data)
            json_wordsID_word_mean[wordsID] = json_data
            #print(json.dumps(json_data, indent=2, ensure_ascii=False))
            
        for i in result.get('Contents'):
            key_data = json.dumps(i.get('Key'))  # flie name will be printed
            key_data_parse = json.loads(key_data)
            
            json_wordsID_list.append(key_data_parse)
    else:
        pass
    
    
    json_IDlist_IdWordMean_data = {
        "json_wordsID_list" : json_wordsID_list,
        "json_wordsID_word_mean" : json_wordsID_word_mean
    }
    
    print(json.dumps(json_IDlist_IdWordMean_data,indent=2,ensure_ascii=False))
    
    return {
        'isBase64Encoded': False,
        'statusCode': 200,
        'headers': {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'     
        },
        'body':json.dumps(json_IDlist_IdWordMean_data,indent=2,ensure_ascii=False)
    }
