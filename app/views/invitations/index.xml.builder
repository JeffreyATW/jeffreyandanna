xml.instruct!
xml.declare! :DOCTYPE, :"svg PUBLIC \"-//W3C//DTD SVG 20001102//EN\"    \"http://www.w3.org/TR/2000/CR-SVG-20001102/DTD/svg-20001102.dtd\"" do |x|
  x.declare! :ENTITY, :ns_graphs, "http://ns.adobe.com/Graphs/1.0/"
  x.declare! :ENTITY, :ns_vars, "http://ns.adobe.com/Variables/1.0/"
  x.declare! :ENTITY, :ns_imrep, "http://ns.adobe.com/ImageReplacement/1.0/"
  x.declare! :ENTITY, :ns_custom, "http://ns.adobe.com/GenericCustomNamespace/1.0/"
  x.declare! :ENTITY, :ns_flows, "http://ns.adobe.com/Flows/1.0/"
  x.declare! :ENTITY, :ns_extend, "http://ns.adobe.com/Extensibility/1.0/"
end
xml.svg do
  xml.variableSets(:xmlns => :'&ns_vars;') do
    xml.variableSet(:varSetName => 'binding1', :locked => 'none') do
      xml.variables do
        xml.variable(:varName => 'RSVP', :category => :'&ns_flows;', :trait => 'textcontent')
        xml.variable(:varName => 'Address', :category => :'&ns_flows;', :trait => 'textcontent')
      end
      xml.v(:sampleDataSets, {'xmlns:v' => :'&ns_vars;', :xmlns => :'&ns_custom;'}) do
        @invitations.each do |invitation|
          xml.v(:sampleDataSet, {:dataSetName => invitation.name}) do
            xml.RSVP do
              xml.p invitation.rsvp
            end
            xml.Address do
              invitation.address.split("\n").each do |line|
                xml.p line
              end
            end
          end
        end
      end
    end
  end
end