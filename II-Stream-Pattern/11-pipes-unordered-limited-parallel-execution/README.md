# Transform stream sequential execution
A Transform stream will never be invoked again with the next chunk of data,
until the previous invocation completes by executing callback() (done())

# _flush function of Transform stream
flush will invoke just before the stream end (all chunks of data got went into the Transform stream)